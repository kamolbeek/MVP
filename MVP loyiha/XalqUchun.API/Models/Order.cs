using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.Models;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ClientId { get; set; }

    [Required]
    public Guid MasterId { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Price { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation
    [ForeignKey("ClientId")]
    public User Client { get; set; } = null!;

    [ForeignKey("MasterId")]
    public MasterProfile Master { get; set; } = null!;

    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;

    public Payment? Payment { get; set; }
    public Chat? Chat { get; set; }
}
