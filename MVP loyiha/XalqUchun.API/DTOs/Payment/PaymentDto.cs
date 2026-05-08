namespace XalqUchun.API.DTOs.Payment;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string PaymentUrl { get; set; } = string.Empty; // Mock URL for the provider
    public DateTime CreatedAt { get; set; }
}
