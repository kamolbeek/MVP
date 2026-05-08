using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class Portfolio
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid MasterId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("MasterId")]
    public MasterProfile Master { get; set; } = null!;
}
