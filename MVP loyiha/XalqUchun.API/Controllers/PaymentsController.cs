using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Payment;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/payments")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    [HttpPost("create")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ApiResponse<PaymentDto>>> CreatePayment([FromBody] CreatePaymentDto dto)
    {
        var clientId = GetCurrentUserId();
        var result = await _paymentService.CreatePaymentAsync(clientId, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("callback")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<bool>>> PaymentCallback([FromBody] PaymentCallbackDto dto)
    {
        // In real world, Payme/Click sends their own formatted requests.
        // We mock it here for the MVP scope.
        var result = await _paymentService.ProcessCallbackAsync(dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{orderId}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<PaymentDto>>> GetPaymentStatus(Guid orderId)
    {
        var result = await _paymentService.GetPaymentByOrderIdAsync(orderId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
