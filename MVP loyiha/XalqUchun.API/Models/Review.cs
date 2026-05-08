using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid MasterId { get; set; }

    [Required]
    public Guid ClientId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("MasterId")]
    public MasterProfile Master { get; set; } = null!;

    [ForeignKey("ClientId")]
    public User Client { get; set; } = null!;
}
