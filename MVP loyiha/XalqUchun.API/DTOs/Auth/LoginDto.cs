using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.Auth;

public class LoginDto
{
    [Required(ErrorMessage = "Phone is required")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}
