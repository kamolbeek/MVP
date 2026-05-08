using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Order;
using XalqUchun.API.Models.Enums;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/orders")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    private UserRole GetCurrentUserRole()
    {
        var claim = User.FindFirst(ClaimTypes.Role);
        return Enum.Parse<UserRole>(claim!.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<OrderDto>.Fail("Invalid data"));

        var userId = GetCurrentUserId();
        var result = await _orderService.CreateOrderAsync(userId, dto);
        if (!result.Success) return BadRequest(result);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<OrderDto>>>> GetMyOrders([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();
        var result = await _orderService.GetMyOrdersAsync(userId, role, page, limit);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetOrderById(Guid id)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.GetOrderByIdAsync(userId, id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.UpdateOrderStatusAsync(userId, id, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
