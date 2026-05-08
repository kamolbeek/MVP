namespace XalqUchun.API.DTOs.Chat;

public class ChatDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientAvatar { get; set; }
    public Guid MasterId { get; set; }
    public string MasterName { get; set; } = string.Empty;
    public string? MasterAvatar { get; set; }
    public DateTime CreatedAt { get; set; }
    public MessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
}
