namespace XalqUchun.API.DTOs.Order;

public class OrderDto
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public Guid MasterId { get; set; }
    public string MasterName { get; set; } = string.Empty;
    public string? MasterAvatar { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? PaymentStatus { get; set; }
}
