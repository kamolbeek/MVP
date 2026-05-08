using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.User;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/users")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetMyProfile()
    {
        var result = await _userService.GetMyProfileAsync(GetCurrentUserId());
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("me")]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateProfile([FromBody] UpdateUserDto dto)
    {
        var result = await _userService.UpdateProfileAsync(GetCurrentUserId(), dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("me/avatar")]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateAvatar([FromBody] UpdateAvatarDto dto)
    {
        var result = await _userService.UpdateAvatarAsync(GetCurrentUserId(), dto.AvatarUrl);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("me")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteAccount()
    {
        var result = await _userService.DeleteAccountAsync(GetCurrentUserId());
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
