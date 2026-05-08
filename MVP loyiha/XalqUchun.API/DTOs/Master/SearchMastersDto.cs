namespace XalqUchun.API.DTOs.Master;

public class SearchMastersDto
{
    public string? Query { get; set; }
    public string? Category { get; set; }
    public string? District { get; set; }
    public decimal? MinRating { get; set; }
    public bool? IsAvailable { get; set; }
    public string? SortBy { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
