using System.ComponentModel.DataAnnotations;
using XalqUchun.API.Models.Enums;

namespace XalqUchun.API.DTOs.Order;

public class UpdateOrderStatusDto
{
    [Required]
    public OrderStatus Status { get; set; }
}
