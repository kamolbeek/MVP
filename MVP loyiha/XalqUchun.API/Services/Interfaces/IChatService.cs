using XalqUchun.API.DTOs.Chat;
using XalqUchun.API.DTOs.Common;

namespace XalqUchun.API.Services.Interfaces;

public interface IChatService
{
    Task<ApiResponse<ChatDto>> CreateChatAsync(Guid userId, CreateChatDto dto);
    Task<ApiResponse<List<ChatDto>>> GetMyChatsAsync(Guid userId);
    Task<ApiResponse<List<MessageDto>>> GetChatMessagesAsync(Guid userId, Guid chatId);
    Task<ApiResponse<MessageDto>> SaveMessageAsync(Guid senderId, Guid chatId, string text);
    Task<ApiResponse<bool>> MarkMessagesAsReadAsync(Guid userId, Guid chatId);
}
