using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Order;
using XalqUchun.API.Models;
using XalqUchun.API.Models.Enums;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<OrderDto>> CreateOrderAsync(Guid clientId, CreateOrderDto dto)
    {
        var master = await _context.MasterProfiles.Include(m => m.User).FirstOrDefaultAsync(m => m.Id == dto.MasterId);
        if (master == null) return ApiResponse<OrderDto>.Fail("Master not found");

        if (!master.IsAvailable) return ApiResponse<OrderDto>.Fail("Master is currently not available");
        if (master.UserId == clientId) return ApiResponse<OrderDto>.Fail("You cannot order from yourself");

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null) return ApiResponse<OrderDto>.Fail("Category not found");

        var order = new Order
        {
            ClientId = clientId,
            MasterId = dto.MasterId,
            CategoryId = dto.CategoryId,
            Description = dto.Description,
            Price = dto.Price,
            Status = OrderStatus.Pending
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var client = await _context.Users.FindAsync(clientId);

        var resultDto = new OrderDto
        {
            Id = order.Id,
            ClientId = order.ClientId,
            ClientName = client!.Name,
            MasterId = order.MasterId,
            MasterName = master.User.Name,
            MasterAvatar = master.User.AvatarUrl,
            CategoryName = category.Name,
            Description = order.Description,
            Status = order.Status.ToString(),
            Price = order.Price,
            CreatedAt = order.CreatedAt
        };

        return ApiResponse<OrderDto>.Ok(resultDto, "Order created successfully");
    }

    public async Task<ApiResponse<PagedResult<OrderDto>>> GetMyOrdersAsync(Guid userId, UserRole role, int page, int limit)
    {
        var query = _context.Orders
            .Include(o => o.Client)
            .Include(o => o.Master).ThenInclude(m => m.User)
            .Include(o => o.Category)
            .Include(o => o.Payment)
            .AsQueryable();

        if (role == UserRole.Client)
        {
            query = query.Where(o => o.ClientId == userId);
        }
        else if (role == UserRole.Master)
        {
            var master = await _context.MasterProfiles.FirstOrDefaultAsync(m => m.UserId == userId);
            if (master == null) return ApiResponse<PagedResult<OrderDto>>.Fail("Master profile not found");
            query = query.Where(o => o.MasterId == master.Id);
        }

        query = query.OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)limit);

        var orders = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

        var items = orders.Select(o => new OrderDto
        {
            Id = o.Id,
            ClientId = o.ClientId,
            ClientName = o.Client.Name,
            MasterId = o.MasterId,
            MasterName = o.Master.User.Name,
            MasterAvatar = o.Master.User.AvatarUrl,
            CategoryName = o.Category.Name,
            Description = o.Description,
            Status = o.Status.ToString(),
            Price = o.Price,
            CreatedAt = o.CreatedAt,
            CompletedAt = o.CompletedAt,
            PaymentStatus = o.Payment?.Status.ToString()
        }).ToList();

        var result = new PagedResult<OrderDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            Limit = limit,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrevious = page > 1
        };

        return ApiResponse<PagedResult<OrderDto>>.Ok(result);
    }

    public async Task<ApiResponse<OrderDto>> GetOrderByIdAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Client)
            .Include(o => o.Master).ThenInclude(m => m.User)
            .Include(o => o.Category)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return ApiResponse<OrderDto>.Fail("Order not found");

        if (order.ClientId != userId && order.Master.UserId != userId)
            return ApiResponse<OrderDto>.Fail("Unauthorized to view this order");

        var dto = new OrderDto
        {
            Id = order.Id,
            ClientId = order.ClientId,
            ClientName = order.Client.Name,
            MasterId = order.MasterId,
            MasterName = order.Master.User.Name,
            MasterAvatar = order.Master.User.AvatarUrl,
            CategoryName = order.Category.Name,
            Description = order.Description,
            Status = order.Status.ToString(),
            Price = order.Price,
            CreatedAt = order.CreatedAt,
            CompletedAt = order.CompletedAt,
            PaymentStatus = order.Payment?.Status.ToString()
        };

        return ApiResponse<OrderDto>.Ok(dto);
    }

    public async Task<ApiResponse<OrderDto>> UpdateOrderStatusAsync(Guid userId, Guid orderId, UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Client)
            .Include(o => o.Master).ThenInclude(m => m.User)
            .Include(o => o.Category)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return ApiResponse<OrderDto>.Fail("Order not found");

        bool isClient = order.ClientId == userId;
        bool isMaster = order.Master.UserId == userId;

        if (!isClient && !isMaster)
            return ApiResponse<OrderDto>.Fail("Unauthorized");

        bool validTransition = false;

        if (isMaster)
        {
            validTransition = (order.Status == OrderStatus.Pending && dto.Status == OrderStatus.Accepted) ||
                              (order.Status == OrderStatus.Accepted && dto.Status == OrderStatus.InProgress) ||
                              (order.Status == OrderStatus.InProgress && dto.Status == OrderStatus.Completed);
        }
        else if (isClient)
        {
            validTransition = (order.Status == OrderStatus.Pending && dto.Status == OrderStatus.Cancelled) ||
                              (order.Status == OrderStatus.Accepted && dto.Status == OrderStatus.Cancelled);
        }

        if (!validTransition)
            return ApiResponse<OrderDto>.Fail($"Invalid status transition from {order.Status} to {dto.Status}");

        order.Status = dto.Status;
        
        if (dto.Status == OrderStatus.Completed || dto.Status == OrderStatus.Cancelled)
        {
            order.CompletedAt = DateTime.UtcNow;
            
            // Re-activate master availability if it was InProgress (optional business logic)
            // if (dto.Status == OrderStatus.Completed) order.Master.IsAvailable = true;
        }

        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(userId, orderId);
    }
}
