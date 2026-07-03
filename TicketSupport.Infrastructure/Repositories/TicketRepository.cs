using Microsoft.EntityFrameworkCore;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Infrastructure.Data;

namespace TicketSupport.Infrastructure.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly ApplicationDbContext _context;

    public TicketRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Ticket ticket)
    {
        await _context.Tickets.AddAsync(ticket);
    }

    public async Task<List<Ticket>> GetAllAsync()
    {
        return await _context.Tickets.ToListAsync();
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _context.Tickets
            .FirstOrDefaultAsync(x => x.TicketId == id);
    }

    public async Task<List<Ticket>> GetAssignedTicketsAsync(int engineerId)
    {
        return await _context.Tickets
            .Where(x => x.AssignedEngineerId == engineerId)
            .ToListAsync();
    }

    public async Task<List<Ticket>> GetTicketsByUserIdAsync(int userId)
    {
        return await _context.Tickets
            .Where(x => x.CreatedByUserId == userId)
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();
    }

    public Task UpdateAsync(Ticket ticket)
    {
      _context.Tickets.Update(ticket);
      return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }


}