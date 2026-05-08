using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        await base.OnConnectedAsync();
    }

    public async Task SendMessage(Guid chatId, Guid receiverId, string text)
    {
        var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(senderIdStr)) return;

        var senderId = Guid.Parse(senderIdStr);
        var result = await _chatService.SaveMessageAsync(senderId, chatId, text);

        if (result.Success && result.Data != null)
        {
            // Send to receiver
            await Clients.Group(receiverId.ToString()).SendAsync("ReceiveMessage", result.Data);
            
            // Send to sender (to confirm it's sent on other devices of the same user)
            await Clients.Group(senderIdStr).SendAsync("ReceiveMessage", result.Data);
        }
    }

    public async Task MarkAsRead(Guid chatId)
    {
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr)) return;

        var userId = Guid.Parse(userIdStr);
        var result = await _chatService.MarkMessagesAsReadAsync(userId, chatId);

        if (result.Success)
        {
            // Optional: Notify the sender that messages were read
            // requires finding the chat and notifying the other party.
        }
    }
}
