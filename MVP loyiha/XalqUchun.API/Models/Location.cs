using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class Location
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [MaxLength(100)]
    public string City { get; set; } = "Toshkent";

    [Column(TypeName = "decimal(10,7)")]
    public decimal Lat { get; set; }

    [Column(TypeName = "decimal(10,7)")]
    public decimal Lng { get; set; }

    // Navigation
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
