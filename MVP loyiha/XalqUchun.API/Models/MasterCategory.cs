using System.ComponentModel.DataAnnotations.Schema;

namespace XalqUchun.API.Models;

public class MasterCategory
{
    public Guid MasterId { get; set; }
    public Guid CategoryId { get; set; }

    // Navigation
    [ForeignKey("MasterId")]
    public MasterProfile Master { get; set; } = null!;

    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;
}
