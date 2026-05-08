using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Icon = c.Icon
            })
            .ToListAsync();

        return ApiResponse<List<CategoryDto>>.Ok(categories);
    }
}
