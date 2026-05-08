using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.Master;

public class AddPortfolioDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    [Required]
    public string ImageUrl { get; set; } = string.Empty;
}
