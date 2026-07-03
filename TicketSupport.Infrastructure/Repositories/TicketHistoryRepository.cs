using Microsoft.EntityFrameworkCore;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Infrastructure.Data;

namespace TicketSupport.Infrastructure.Repositories;

public class TicketHistoryRepository : ITicketHistoryRepository
{
    private readonly ApplicationDbContext _context;

    public TicketHistoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TicketHistory history)
    {
        await _context.TicketHistories.AddAsync(history);
    }

    public async Task<List<TicketHistory>> GetByTicketIdAsync(int ticketId)
    {
        return await _context.TicketHistories
            .Where(x => x.TicketId == ticketId)
            .OrderByDescending(x => x.UpdatedDate)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}