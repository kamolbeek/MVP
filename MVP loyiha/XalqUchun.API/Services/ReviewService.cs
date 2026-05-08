using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.DTOs.Review;
using XalqUchun.API.Models;
using XalqUchun.API.Models.Enums;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ReviewDto>> CreateReviewAsync(Guid clientId, CreateReviewDto dto)
    {
        var master = await _context.MasterProfiles.FirstOrDefaultAsync(m => m.Id == dto.MasterId);
        if (master == null)
            return ApiResponse<ReviewDto>.Fail("Master not found");

        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.ClientId == clientId && r.MasterId == dto.MasterId);
        if (existingReview != null)
            return ApiResponse<ReviewDto>.Fail("Siz bu ustaga allaqachon sharh qoldirgansiz");

        var hasCompletedOrder = await _context.Orders
            .AnyAsync(o => o.ClientId == clientId && o.MasterId == dto.MasterId && o.Status == OrderStatus.Completed);
        
        if (!hasCompletedOrder)
            return ApiResponse<ReviewDto>.Fail("Sharh yozish uchun avval usta bilan ish bajargan bo'lishingiz kerak");

        var review = new Review
        {
            MasterId = dto.MasterId,
            ClientId = clientId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        await RecalculateMasterRating(dto.MasterId);

        var clientUser = await _context.Users.FindAsync(clientId);

        var resultDto = new ReviewDto
        {
            Id = review.Id,
            ClientId = review.ClientId,
            ClientName = clientUser!.Name,
            ClientAvatar = clientUser.AvatarUrl,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };

        return ApiResponse<ReviewDto>.Ok(resultDto, "Sharh muvaffaqiyatli qo'shildi");
    }

    public async Task<ApiResponse<bool>> DeleteReviewAsync(Guid clientId, Guid reviewId)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
            return ApiResponse<bool>.Fail("Review not found");

        if (review.ClientId != clientId)
            return ApiResponse<bool>.Fail("Unauthroized to delete this review");

        var masterId = review.MasterId;
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        await RecalculateMasterRating(masterId);

        return ApiResponse<bool>.Ok(true, "Sharh o'chirildi");
    }

    public async Task<ApiResponse<PagedResult<ReviewDto>>> GetMasterReviewsAsync(Guid masterId, int page, int limit)
    {
        var query = _context.Reviews
            .Include(r => r.Client)
            .Where(r => r.MasterId == masterId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)limit);

        var reviews = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var items = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ClientId = r.ClientId,
            ClientName = r.Client.Name,
            ClientAvatar = r.Client.AvatarUrl,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        }).ToList();

        var result = new PagedResult<ReviewDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            Limit = limit,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrevious = page > 1
        };

        return ApiResponse<PagedResult<ReviewDto>>.Ok(result);
    }

    public async Task<ApiResponse<ReviewSummaryDto>> GetReviewSummaryAsync(Guid masterId)
    {
        var reviews = await _context.Reviews.Where(r => r.MasterId == masterId).ToListAsync();

        var summary = new ReviewSummaryDto
        {
            TotalReviews = reviews.Count,
            AverageRating = reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0,
            FiveStar = reviews.Count(r => r.Rating == 5),
            FourStar = reviews.Count(r => r.Rating == 4),
            ThreeStar = reviews.Count(r => r.Rating == 3),
            TwoStar = reviews.Count(r => r.Rating == 2),
            OneStar = reviews.Count(r => r.Rating == 1)
        };

        return ApiResponse<ReviewSummaryDto>.Ok(summary);
    }

    private async Task RecalculateMasterRating(Guid masterId)
    {
        var master = await _context.MasterProfiles.Include(m => m.Reviews).FirstOrDefaultAsync(m => m.Id == masterId);
        if (master != null)
        {
            master.ReviewCount = master.Reviews.Count;
            master.Rating = master.Reviews.Any() ? (decimal)master.Reviews.Average(r => r.Rating) : 0;
            await _context.SaveChangesAsync();
        }
    }
}
