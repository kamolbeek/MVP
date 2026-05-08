using System.ComponentModel.DataAnnotations;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone is required")]
    [RegularExpression(@"^\+998\d{9}$", ErrorMessage = "Phone must be in format +998XXXXXXXXX")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Client;

    // Master specific fields
    public string? Bio { get; set; }
    public int? ExperienceYears { get; set; }
    public string? District { get; set; }
    public List<Guid>? CategoryIds { get; set; }
}
