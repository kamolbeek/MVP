using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Payment;

namespace XalqUchun.API.Services.Interfaces;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> CreatePaymentAsync(Guid clientId, CreatePaymentDto dto);
    Task<ApiResponse<bool>> ProcessCallbackAsync(PaymentCallbackDto dto);
    Task<ApiResponse<PaymentDto>> GetPaymentByOrderIdAsync(Guid orderId);
}
