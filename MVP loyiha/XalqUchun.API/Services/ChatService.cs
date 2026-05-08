using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Chat;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.Models;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ChatDto>> CreateChatAsync(Guid userId, CreateChatDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Master)
            .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

        if (order == null) return ApiResponse<ChatDto>.Fail("Order not found");
        
        if (order.ClientId != userId && order.Master.UserId != userId)
            return ApiResponse<ChatDto>.Fail("Unauthorized to create chat for this order");

        var existingChat = await _context.Chats.FirstOrDefaultAsync(c => c.OrderId == dto.OrderId);
        if (existingChat != null)
            return ApiResponse<ChatDto>.Fail("Chat already exists for this order");

        var chat = new Chat
        {
            OrderId = order.Id,
            ClientId = order.ClientId,
            MasterId = order.Master.UserId
        };

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        var client = await _context.Users.FindAsync(chat.ClientId);
        var master = await _context.Users.FindAsync(chat.MasterId);

        var chatDto = new ChatDto
        {
            Id = chat.Id,
            OrderId = chat.OrderId,
            ClientId = chat.ClientId,
            ClientName = client!.Name,
            ClientAvatar = client.AvatarUrl,
            MasterId = chat.MasterId,
            MasterName = master!.Name,
            MasterAvatar = master.AvatarUrl,
            CreatedAt = chat.CreatedAt,
            UnreadCount = 0
        };

        return ApiResponse<ChatDto>.Ok(chatDto, "Chat created");
    }

    public async Task<ApiResponse<List<ChatDto>>> GetMyChatsAsync(Guid userId)
    {
        var chats = await _context.Chats
            .Include(c => c.Client)
            .Include(c => c.Master)
            .Include(c => c.Messages)
            .Where(c => c.ClientId == userId || c.MasterId == userId)
            .ToListAsync();

        var result = chats.Select(c => new ChatDto
        {
            Id = c.Id,
            OrderId = c.OrderId,
            ClientId = c.ClientId,
            ClientName = c.Client.Name,
            ClientAvatar = c.Client.AvatarUrl,
            MasterId = c.MasterId,
            MasterName = c.Master.Name,
            MasterAvatar = c.Master.AvatarUrl,
            CreatedAt = c.CreatedAt,
            LastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).Select(m => new MessageDto
            {
                Id = m.Id,
                ChatId = m.ChatId,
                SenderId = m.SenderId,
                Text = m.Text,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            }).FirstOrDefault(),
            UnreadCount = c.Messages.Count(m => m.SenderId != userId && !m.IsRead)
        }).OrderByDescending(c => c.LastMessage?.CreatedAt ?? c.CreatedAt).ToList();

        return ApiResponse<List<ChatDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<MessageDto>>> GetChatMessagesAsync(Guid userId, Guid chatId)
    {
        var chat = await _context.Chats.FirstOrDefaultAsync(c => c.Id == chatId && (c.ClientId == userId || c.MasterId == userId));
        if (chat == null) return ApiResponse<List<MessageDto>>.Fail("Chat not found or unauthorized");

        var messages = await _context.Messages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                ChatId = m.ChatId,
                SenderId = m.SenderId,
                Text = m.Text,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            }).ToListAsync();

        return ApiResponse<List<MessageDto>>.Ok(messages);
    }

    public async Task<ApiResponse<MessageDto>> SaveMessageAsync(Guid senderId, Guid chatId, string text)
    {
        var chat = await _context.Chats.FirstOrDefaultAsync(c => c.Id == chatId && (c.ClientId == senderId || c.MasterId == senderId));
        if (chat == null) return ApiResponse<MessageDto>.Fail("Chat not found");

        var message = new Message
        {
            ChatId = chatId,
            SenderId = senderId,
            Text = text,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        var dto = new MessageDto
        {
            Id = message.Id,
            ChatId = message.ChatId,
            SenderId = message.SenderId,
            Text = message.Text,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        };

        return ApiResponse<MessageDto>.Ok(dto);
    }

    public async Task<ApiResponse<bool>> MarkMessagesAsReadAsync(Guid userId, Guid chatId)
    {
        var chat = await _context.Chats.FirstOrDefaultAsync(c => c.Id == chatId && (c.ClientId == userId || c.MasterId == userId));
        if (chat == null) return ApiResponse<bool>.Fail("Chat not found");

        var unreadMessages = await _context.Messages
            .Where(m => m.ChatId == chatId && m.SenderId != userId && !m.IsRead)
            .ToListAsync();

        if (unreadMessages.Any())
        {
            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }
            await _context.SaveChangesAsync();
        }

        return ApiResponse<bool>.Ok(true);
    }
}
