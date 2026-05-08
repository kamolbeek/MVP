using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.DTOs.Review;

namespace XalqUchun.API.Services.Interfaces;

public interface IReviewService
{
    Task<ApiResponse<ReviewDto>> CreateReviewAsync(Guid clientId, CreateReviewDto dto);
    Task<ApiResponse<bool>> DeleteReviewAsync(Guid clientId, Guid reviewId);
    Task<ApiResponse<PagedResult<ReviewDto>>> GetMasterReviewsAsync(Guid masterId, int page, int limit);
    Task<ApiResponse<ReviewSummaryDto>> GetReviewSummaryAsync(Guid masterId);
}
