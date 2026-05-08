using System.ComponentModel.DataAnnotations;

namespace XalqUchun.API.DTOs.Review;

public class CreateReviewDto
{
    [Required]
    public Guid MasterId { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    [Required]
    [MinLength(10, ErrorMessage = "Comment must be at least 10 characters")]
    public string Comment { get; set; } = string.Empty;
}
