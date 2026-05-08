using System.ComponentModel.DataAnnotations;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.DTOs.Payment;

public class CreatePaymentDto
{
    [Required]
    public Guid OrderId { get; set; }

    [Required]
    public PaymentProvider Provider { get; set; }
}

public class PaymentCallbackDto
{
    [Required]
    public string TransactionId { get; set; } = string.Empty;

    [Required]
    public PaymentStatus Status { get; set; }
}
