using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.Models;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Icon { get; set; } = string.Empty;

    // Navigation
    public ICollection<MasterCategory> MasterCategories { get; set; } = new List<MasterCategory>();
}
