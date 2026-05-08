namespace XalqUchun.API.DTOs.Master;

public class MasterListItemDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public int ExperienceYears { get; set; }
    public bool IsAvailable { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public string? District { get; set; }
    public List<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
}
