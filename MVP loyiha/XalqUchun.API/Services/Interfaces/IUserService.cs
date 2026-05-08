using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.User;

namespace XalqUchun.API.Services.Interfaces;

public interface IUserService
{
    Task<ApiResponse<UserProfileDto>> GetMyProfileAsync(Guid userId);
    Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateUserDto dto);
    Task<ApiResponse<UserProfileDto>> UpdateAvatarAsync(Guid userId, string avatarUrl);
    Task<ApiResponse<bool>> DeleteAccountAsync(Guid userId);
}
