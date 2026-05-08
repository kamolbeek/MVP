using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class Chat
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OrderId { get; set; }

    [Required]
    public Guid ClientId { get; set; }

    [Required]
    public Guid MasterId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;

    [ForeignKey("ClientId")]
    public User Client { get; set; } = null!;

    [ForeignKey("MasterId")]
    public User Master { get; set; } = null!;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
