using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;

namespace XalqUchun.API.Services.Interfaces;

public interface IMasterService
{
    Task<ApiResponse<PagedResult<MasterListItemDto>>> GetMastersAsync(SearchMastersDto filters);
    Task<ApiResponse<MasterDetailDto>> GetMasterByIdAsync(Guid masterId);
    Task<ApiResponse<MasterDetailDto>> UpdateProfileAsync(Guid userId, UpdateMasterProfileDto dto);
    Task<ApiResponse<bool>> UpdateAvailabilityAsync(Guid userId, bool isAvailable);
    Task<ApiResponse<PortfolioDto>> AddPortfolioAsync(Guid userId, AddPortfolioDto dto);
    Task<ApiResponse<bool>> DeletePortfolioAsync(Guid userId, Guid portfolioId);
}
