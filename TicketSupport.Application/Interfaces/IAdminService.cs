using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface IAdminService
{
    Task<List<UserDto>> GetAllUsersAsync();

    Task<string> ToggleUserStatusAsync(int userId);
}