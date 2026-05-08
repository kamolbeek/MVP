using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.Chat;

public class CreateChatDto
{
    [Required]
    public Guid OrderId { get; set; }
}
