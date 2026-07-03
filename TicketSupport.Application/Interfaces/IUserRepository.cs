using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task AddAsync(User user);

    Task SaveChangesAsync();

    Task<User?> GetAvailableEngineerAsync();

    Task<List<User>> GetAllUsersAsync();

    Task<User?> GetByIdAsync(int userId);

    Task UpdateAsync(User user);
}