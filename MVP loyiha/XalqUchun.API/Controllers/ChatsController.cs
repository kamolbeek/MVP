using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Chat;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/chats")]
[ApiController]
[Authorize]
public class ChatsController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatsController(IChatService chatService)
    {
        _chatService = chatService;
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ChatDto>>>> GetMyChats()
    {
        var result = await _chatService.GetMyChatsAsync(GetCurrentUserId());
        return Ok(result);
    }

    [HttpGet("{id}/messages")]
    public async Task<ActionResult<ApiResponse<List<MessageDto>>>> GetChatMessages(Guid id)
    {
        var result = await _chatService.GetChatMessagesAsync(GetCurrentUserId(), id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ChatDto>>> CreateChat([FromBody] CreateChatDto dto)
    {
        var result = await _chatService.CreateChatAsync(GetCurrentUserId(), dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
