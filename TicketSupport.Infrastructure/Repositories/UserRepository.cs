using Microsoft.EntityFrameworkCore;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Infrastructure.Data;
using TicketSupport.Domain.Enums;

namespace TicketSupport.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetAvailableEngineerAsync()
    {
        var engineers =
            await _context.Users
                .Where(u => u.Role == "Engineer")
                .ToListAsync();

        if (!engineers.Any())
            return null;

        var engineerWorkloads =
            await _context.Tickets
                .Where(t =>
                    t.AssignedEngineerId != null &&
                    t.Status != TicketStatus.Resolved)
                .GroupBy(t => t.AssignedEngineerId)
                .Select(g => new
                {
                    EngineerId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

        return engineers
            .OrderBy(e =>
                engineerWorkloads
                    .FirstOrDefault(w =>
                        w.EngineerId == e.UserId)?.Count ?? 0)
            .First();
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}