using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ChatId { get; set; }

    [Required]
    public Guid SenderId { get; set; }

    [Required]
    [MaxLength(5000)]
    public string Text { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("ChatId")]
    public Chat Chat { get; set; } = null!;

    [ForeignKey("SenderId")]
    public User Sender { get; set; } = null!;
}
