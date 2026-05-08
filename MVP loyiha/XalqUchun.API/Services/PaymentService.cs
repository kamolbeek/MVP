using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Payment;
using XalqUchun.API.Models;
using XalqUchun.API.Models.Enums;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _context;

    public PaymentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PaymentDto>> CreatePaymentAsync(Guid clientId, CreatePaymentDto dto)
    {
        var order = await _context.Orders.Include(o => o.Payment).FirstOrDefaultAsync(o => o.Id == dto.OrderId);
        
        if (order == null) return ApiResponse<PaymentDto>.Fail("Order not found");
        if (order.ClientId != clientId) return ApiResponse<PaymentDto>.Fail("Unauthorized");
        if (order.Price == null || order.Price <= 0) return ApiResponse<PaymentDto>.Fail("Order price is not set");
        
        if (order.Payment != null && order.Payment.Status == PaymentStatus.Paid)
            return ApiResponse<PaymentDto>.Fail("Order is already paid");

        // If payment exists but failed/pending, we can recreate or update it.
        // For simplicity, let's create a new one and remove the old if it exists.
        if (order.Payment != null)
        {
            _context.Payments.Remove(order.Payment);
        }

        var transactionId = Guid.NewGuid().ToString("N"); // Mocking provider transaction ID

        var payment = new Payment
        {
            OrderId = order.Id,
            Amount = order.Price.Value,
            Provider = dto.Provider,
            Status = PaymentStatus.Pending,
            TransactionId = transactionId
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        var paymentUrl = dto.Provider == PaymentProvider.Payme 
            ? $"https://checkout.paycom.uz/{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"m=123456789;ac.order_id={order.Id};a={payment.Amount * 100}"))}" 
            : $"https://my.click.uz/services/pay?service_id=12345&merchant_id=6789&amount={payment.Amount}&transaction_param={order.Id}";

        var resultDto = new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            Amount = payment.Amount,
            Provider = payment.Provider.ToString(),
            Status = payment.Status.ToString(),
            TransactionId = payment.TransactionId,
            PaymentUrl = paymentUrl,
            CreatedAt = payment.CreatedAt
        };

        return ApiResponse<PaymentDto>.Ok(resultDto, "Payment initialized successfully");
    }

    public async Task<ApiResponse<bool>> ProcessCallbackAsync(PaymentCallbackDto dto)
    {
        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionId == dto.TransactionId);
        
        if (payment == null) return ApiResponse<bool>.Fail("Transaction not found");

        payment.Status = dto.Status;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Callback processed successfully");
    }

    public async Task<ApiResponse<PaymentDto>> GetPaymentByOrderIdAsync(Guid orderId)
    {
        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail("Payment not found for this order");

        var dto = new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            Amount = payment.Amount,
            Provider = payment.Provider.ToString(),
            Status = payment.Status.ToString(),
            TransactionId = payment.TransactionId,
            CreatedAt = payment.CreatedAt
        };

        return ApiResponse<PaymentDto>.Ok(dto);
    }
}
