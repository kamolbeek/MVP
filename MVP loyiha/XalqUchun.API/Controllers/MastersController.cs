using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/masters")]
[ApiController]
public class MastersController : ControllerBase
{
    private readonly IMasterService _masterService;

    public MastersController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<MasterListItemDto>>>> GetMasters([FromQuery] SearchMastersDto filters)
    {
        var result = await _masterService.GetMastersAsync(filters);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<MasterDetailDto>>> GetMasterById(Guid id)
    {
        var result = await _masterService.GetMasterByIdAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("profile")]
    [Authorize(Roles = "Master")]
    public async Task<ActionResult<ApiResponse<MasterDetailDto>>> UpdateProfile([FromBody] UpdateMasterProfileDto dto)
    {
        var userId = GetCurrentUserId();
        var result = await _masterService.UpdateProfileAsync(userId, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("availability")]
    [Authorize(Roles = "Master")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateAvailability([FromBody] UpdateAvailabilityRequest request)
    {
        var userId = GetCurrentUserId();
        var result = await _masterService.UpdateAvailabilityAsync(userId, request.IsAvailable);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("portfolio")]
    [Authorize(Roles = "Master")]
    public async Task<ActionResult<ApiResponse<PortfolioDto>>> AddPortfolio([FromBody] AddPortfolioDto dto)
    {
        var userId = GetCurrentUserId();
        var result = await _masterService.AddPortfolioAsync(userId, dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("portfolio/{id}")]
    [Authorize(Roles = "Master")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePortfolio(Guid id)
    {
        var userId = GetCurrentUserId();
        var result = await _masterService.DeletePortfolioAsync(userId, id);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}

public class UpdateAvailabilityRequest
{
    public bool IsAvailable { get; set; }
}
