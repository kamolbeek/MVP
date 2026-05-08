using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Order;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.Services.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> CreateOrderAsync(Guid clientId, CreateOrderDto dto);
    Task<ApiResponse<PagedResult<OrderDto>>> GetMyOrdersAsync(Guid userId, UserRole role, int page, int limit);
    Task<ApiResponse<OrderDto>> GetOrderByIdAsync(Guid userId, Guid orderId);
    Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(Guid userId, Guid orderId, UpdateOrderStatusDto dto);
}
