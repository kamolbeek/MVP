namespace XalqUchun.API.DTOs.Master;

public class UpdateMasterProfileDto
{
    public string? Bio { get; set; }
    public int? ExperienceYears { get; set; }
    public string? Instagram { get; set; }
    public string? Telegram { get; set; }
    public string? Youtube { get; set; }
    public List<Guid>? CategoryIds { get; set; }
    public string? District { get; set; }
}
