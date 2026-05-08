using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.DTOs.Review;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/reviews")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ApiResponse<ReviewDto>>> CreateReview([FromBody] CreateReviewDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<ReviewDto>.Fail("Invalid data"));

        var clientId = GetCurrentUserId();
        var result = await _reviewService.CreateReviewAsync(clientId, dto);
        if (!result.Success) return BadRequest(result);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Client")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(Guid id)
    {
        var clientId = GetCurrentUserId();
        var result = await _reviewService.DeleteReviewAsync(clientId, id);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("master/{masterId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<ReviewDto>>>> GetMasterReviews(Guid masterId, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var result = await _reviewService.GetMasterReviewsAsync(masterId, page, limit);
        return Ok(result);
    }

    [HttpGet("master/{masterId}/summary")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<ReviewSummaryDto>>> GetReviewSummary(Guid masterId)
    {
        var result = await _reviewService.GetReviewSummaryAsync(masterId);
        return Ok(result);
    }
}
