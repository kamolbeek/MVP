using System.ComponentModel.DataAnnotations;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Client;

    public string? AvatarUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    // Navigation properties
    public MasterProfile? MasterProfile { get; set; }
    public Location? Location { get; set; }
    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
