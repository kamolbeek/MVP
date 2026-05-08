using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;

namespace XalqUchun.API.Services.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync();
}
