using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using XalqUchun.API.Data;
using XalqUchun.API.DTOs.Auth;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.Models;
using XalqUchun.API.Models.Enums;
using XalqUchun.API.Services.Interfaces;
using BCrypt.Net;

namespace XalqUchun.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Phone == dto.Phone))
        {
            return ApiResponse<AuthResponseDto>.Fail("Phone number is already registered.");
        }

        var user = new User
        {
            Name = dto.Name,
            Phone = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role
        };

        _context.Users.Add(user);

        if (dto.Role == UserRole.Master)
        {
            var masterProfile = new MasterProfile
            {
                UserId = user.Id,
                Bio = dto.Bio,
                ExperienceYears = dto.ExperienceYears ?? 0
            };
            _context.MasterProfiles.Add(masterProfile);

            var location = new Location
            {
                UserId = user.Id,
                District = dto.District ?? "Toshkent",
                City = "Toshkent"
            };
            _context.Locations.Add(location);

            if (dto.CategoryIds != null && dto.CategoryIds.Any())
            {
                foreach (var catId in dto.CategoryIds)
                {
                    _context.MasterCategories.Add(new MasterCategory
                    {
                        MasterId = masterProfile.Id,
                        CategoryId = catId
                    });
                }
            }
        }

        user.RefreshToken = Guid.NewGuid().ToString();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);

        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        var response = new AuthResponseDto
        {
            UserId = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
            AccessToken = token,
            RefreshToken = user.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["JwtSettings:ExpiryDays"] ?? "7"))
        };

        return ApiResponse<AuthResponseDto>.Ok(response, "User registered successfully");
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == dto.Phone);
        if (user == null)
            return ApiResponse<AuthResponseDto>.Fail("Invalid phone or password.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return ApiResponse<AuthResponseDto>.Fail("Invalid phone or password.");

        if (!user.IsActive)
            return ApiResponse<AuthResponseDto>.Fail("Account is banned or inactive.");

        user.RefreshToken = Guid.NewGuid().ToString();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        var response = new AuthResponseDto
        {
            UserId = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
            AccessToken = token,
            RefreshToken = user.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["JwtSettings:ExpiryDays"] ?? "7"))
        };

        return ApiResponse<AuthResponseDto>.Ok(response, "Login successful");
    }

    public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null)
            return ApiResponse<AuthResponseDto>.Fail("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            return ApiResponse<AuthResponseDto>.Fail("Refresh token expired. Please login again.");

        user.RefreshToken = Guid.NewGuid().ToString();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);

        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        var response = new AuthResponseDto
        {
            UserId = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            AvatarUrl = user.AvatarUrl,
            AccessToken = token,
            RefreshToken = user.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["JwtSettings:ExpiryDays"] ?? "7"))
        };

        return ApiResponse<AuthResponseDto>.Ok(response, "Token refreshed successfully");
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);
        var expiryDays = int.Parse(jwtSettings["ExpiryDays"] ?? "7");

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.MobilePhone, user.Phone)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(expiryDays),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
