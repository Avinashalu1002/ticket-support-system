using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;

    public AdminService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();

        return users.Select(x => new UserDto
        {
            UserId = x.UserId,
            Name = x.Name,
            Email = x.Email,
            Role = x.Role,
            IsActive = x.IsActive
        }).ToList();
    }

    public async Task<string> ToggleUserStatusAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
            return "User Not Found";

        user.IsActive = !user.IsActive;

        await _userRepository.UpdateAsync(user);

        return $"User {(user.IsActive ? "Activated" : "Deactivated")} Successfully";
    }
}