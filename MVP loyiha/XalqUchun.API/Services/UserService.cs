using Microsoft.EntityFrameworkCore;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.User;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<UserProfileDto>> GetMyProfileAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return ApiResponse<UserProfileDto>.Fail("User not found");

        var dto = new UserProfileDto
        {
            Id = user.Id,
            Phone = user.Phone,
            Name = user.Name,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt
        };

        return ApiResponse<UserProfileDto>.Ok(dto);
    }

    public async Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return ApiResponse<UserProfileDto>.Fail("User not found");

        user.Name = dto.Name;
        await _context.SaveChangesAsync();

        return await GetMyProfileAsync(userId);
    }

    public async Task<ApiResponse<UserProfileDto>> UpdateAvatarAsync(Guid userId, string avatarUrl)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return ApiResponse<UserProfileDto>.Fail("User not found");

        user.AvatarUrl = avatarUrl;
        await _context.SaveChangesAsync();

        return await GetMyProfileAsync(userId);
    }

    public async Task<ApiResponse<bool>> DeleteAccountAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return ApiResponse<bool>.Fail("User not found");

        user.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Account deleted successfully");
    }
}
