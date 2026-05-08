namespace XalqUchun.API.DTOs.Master;

public class MasterDetailDto : MasterListItemDto
{
    public string? Instagram { get; set; }
    public string? Telegram { get; set; }
    public string? Youtube { get; set; }
    public List<PortfolioDto> Portfolio { get; set; } = new List<PortfolioDto>();
    public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
}
