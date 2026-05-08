using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.User;

public class UpdateUserDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public class UpdateAvatarDto
{
    [Required]
    public string AvatarUrl { get; set; } = string.Empty;
}
