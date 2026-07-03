using Microsoft.EntityFrameworkCore;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Infrastructure.Data;

namespace TicketSupport.Infrastructure.Repositories;

public class TicketCommentRepository : ITicketCommentRepository
{
    private readonly ApplicationDbContext _context;

    public TicketCommentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TicketComment comment)
    {
        await _context.TicketComments.AddAsync(comment);
    }

    public async Task<List<TicketComment>> GetByTicketIdAsync(int ticketId)
    {
        return await _context.TicketComments
            .Where(x => x.TicketId == ticketId)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}