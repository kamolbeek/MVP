using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.Order;

public class CreateOrderDto
{
    [Required]
    public Guid MasterId { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [MinLength(20, ErrorMessage = "Description must be at least 20 characters")]
    public string Description { get; set; } = string.Empty;

    public decimal? Price { get; set; }
}
