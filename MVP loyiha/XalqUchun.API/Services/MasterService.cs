using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.Models;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class MasterService : IMasterService
{
    private readonly AppDbContext _context;

    public MasterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PagedResult<MasterListItemDto>>> GetMastersAsync(SearchMastersDto filters)
    {
        var query = _context.MasterProfiles
            .Include(m => m.User)
                .ThenInclude(u => u.Location)
            .Include(m => m.Categories)
                .ThenInclude(mc => mc.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            var search = filters.Query.ToLower();
            query = query.Where(m => m.User.Name.ToLower().Contains(search) || (m.Bio != null && m.Bio.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(filters.Category))
        {
            query = query.Where(m => m.Categories.Any(mc => mc.Category.Slug == filters.Category));
        }

        if (!string.IsNullOrWhiteSpace(filters.District))
        {
            query = query.Where(m => m.User.Location != null && m.User.Location.District == filters.District);
        }

        if (filters.MinRating.HasValue)
        {
            query = query.Where(m => m.Rating >= filters.MinRating.Value);
        }

        if (filters.IsAvailable.HasValue)
        {
            query = query.Where(m => m.IsAvailable == filters.IsAvailable.Value);
        }

        query = filters.SortBy?.ToLower() switch
        {
            "reviews" => query.OrderByDescending(m => m.ReviewCount),
            "newest" => query.OrderByDescending(m => m.CreatedAt),
            _ => query.OrderByDescending(m => m.Rating)
        };

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)filters.Limit);
        
        var masters = await query
            .Skip((filters.Page - 1) * filters.Limit)
            .Take(filters.Limit)
            .ToListAsync();

        var items = masters.Select(m => new MasterListItemDto
        {
            Id = m.Id,
            UserId = m.UserId,
            Name = m.User.Name,
            AvatarUrl = m.User.AvatarUrl,
            Bio = m.Bio,
            ExperienceYears = m.ExperienceYears,
            IsAvailable = m.IsAvailable,
            Rating = m.Rating,
            ReviewCount = m.ReviewCount,
            District = m.User.Location?.District,
            Categories = m.Categories.Select(mc => new CategoryDto
            {
                Id = mc.Category.Id,
                Name = mc.Category.Name,
                Slug = mc.Category.Slug,
                Icon = mc.Category.Icon
            }).ToList()
        }).ToList();

        var result = new PagedResult<MasterListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filters.Page,
            Limit = filters.Limit,
            TotalPages = totalPages,
            HasNext = filters.Page < totalPages,
            HasPrevious = filters.Page > 1
        };

        return ApiResponse<PagedResult<MasterListItemDto>>.Ok(result);
    }

    public async Task<ApiResponse<MasterDetailDto>> GetMasterByIdAsync(Guid masterId)
    {
        var master = await _context.MasterProfiles
            .Include(m => m.User)
                .ThenInclude(u => u.Location)
            .Include(m => m.Categories)
                .ThenInclude(mc => mc.Category)
            .Include(m => m.Portfolio)
            .Include(m => m.Reviews)
                .ThenInclude(r => r.Client)
            .FirstOrDefaultAsync(m => m.Id == masterId);

        if (master == null)
            return ApiResponse<MasterDetailDto>.Fail("Master not found");

        var dto = new MasterDetailDto
        {
            Id = master.Id,
            UserId = master.UserId,
            Name = master.User.Name,
            AvatarUrl = master.User.AvatarUrl,
            Bio = master.Bio,
            ExperienceYears = master.ExperienceYears,
            IsAvailable = master.IsAvailable,
            Rating = master.Rating,
            ReviewCount = master.ReviewCount,
            District = master.User.Location?.District,
            Categories = master.Categories.Select(mc => new CategoryDto
            {
                Id = mc.Category.Id,
                Name = mc.Category.Name,
                Slug = mc.Category.Slug,
                Icon = mc.Category.Icon
            }).ToList(),
            Instagram = master.Instagram,
            Telegram = master.Telegram,
            Youtube = master.Youtube,
            Portfolio = master.Portfolio.Select(p => new PortfolioDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt
            }).OrderByDescending(p => p.CreatedAt).ToList(),
            Reviews = master.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                ClientId = r.ClientId,
                ClientName = r.Client.Name,
                ClientAvatar = r.Client.AvatarUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).OrderByDescending(r => r.CreatedAt).ToList()
        };

        return ApiResponse<MasterDetailDto>.Ok(dto);
    }

    public async Task<ApiResponse<MasterDetailDto>> UpdateProfileAsync(Guid userId, UpdateMasterProfileDto dto)
    {
        var master = await _context.MasterProfiles
            .Include(m => m.User)
                .ThenInclude(u => u.Location)
            .Include(m => m.Categories)
            .FirstOrDefaultAsync(m => m.UserId == userId);

        if (master == null)
            return ApiResponse<MasterDetailDto>.Fail("Master profile not found");

        if (dto.Bio != null) master.Bio = dto.Bio;
        if (dto.ExperienceYears.HasValue) master.ExperienceYears = dto.ExperienceYears.Value;
        if (dto.Instagram != null) master.Instagram = dto.Instagram;
        if (dto.Telegram != null) master.Telegram = dto.Telegram;
        if (dto.Youtube != null) master.Youtube = dto.Youtube;

        if (dto.District != null && master.User.Location != null)
        {
            master.User.Location.District = dto.District;
        }

        if (dto.CategoryIds != null)
        {
            _context.MasterCategories.RemoveRange(master.Categories);
            foreach (var catId in dto.CategoryIds)
            {
                _context.MasterCategories.Add(new MasterCategory
                {
                    MasterId = master.Id,
                    CategoryId = catId
                });
            }
        }

        await _context.SaveChangesAsync();
        
        return await GetMasterByIdAsync(master.Id);
    }

    public async Task<ApiResponse<bool>> UpdateAvailabilityAsync(Guid userId, bool isAvailable)
    {
        var master = await _context.MasterProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
        if (master == null)
            return ApiResponse<bool>.Fail("Master profile not found");

        master.IsAvailable = isAvailable;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true);
    }

    public async Task<ApiResponse<PortfolioDto>> AddPortfolioAsync(Guid userId, AddPortfolioDto dto)
    {
        var master = await _context.MasterProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
        if (master == null)
            return ApiResponse<PortfolioDto>.Fail("Master profile not found");

        var portfolio = new Portfolio
        {
            MasterId = master.Id,
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl
        };

        _context.Portfolios.Add(portfolio);
        await _context.SaveChangesAsync();

        var result = new PortfolioDto
        {
            Id = portfolio.Id,
            Title = portfolio.Title,
            Description = portfolio.Description,
            ImageUrl = portfolio.ImageUrl,
            CreatedAt = portfolio.CreatedAt
        };

        return ApiResponse<PortfolioDto>.Ok(result, "Portfolio added successfully");
    }

    public async Task<ApiResponse<bool>> DeletePortfolioAsync(Guid userId, Guid portfolioId)
    {
        var master = await _context.MasterProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
        if (master == null)
            return ApiResponse<bool>.Fail("Master profile not found");

        var portfolio = await _context.Portfolios.FirstOrDefaultAsync(p => p.Id == portfolioId && p.MasterId == master.Id);
        if (portfolio == null)
            return ApiResponse<bool>.Fail("Portfolio not found or unauthorized");

        _context.Portfolios.Remove(portfolio);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Portfolio deleted successfully");
    }
}
