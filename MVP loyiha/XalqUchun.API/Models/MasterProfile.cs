using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class MasterProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(1000)]
    public string? Bio { get; set; }

    public int ExperienceYears { get; set; }

    public bool IsAvailable { get; set; } = true;

    [Column(TypeName = "decimal(3,2)")]
    public decimal Rating { get; set; } = 0;

    public int ReviewCount { get; set; } = 0;

    [MaxLength(200)]
    public string? Instagram { get; set; }

    [MaxLength(200)]
    public string? Telegram { get; set; }

    [MaxLength(200)]
    public string? Youtube { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public ICollection<MasterCategory> Categories { get; set; } = new List<MasterCategory>();
    public ICollection<Portfolio> Portfolio { get; set; } = new List<Portfolio>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
