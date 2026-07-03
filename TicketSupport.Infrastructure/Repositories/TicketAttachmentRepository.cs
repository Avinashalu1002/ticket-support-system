using Microsoft.EntityFrameworkCore;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Infrastructure.Data;

namespace TicketSupport.Infrastructure.Repositories;

public class TicketAttachmentRepository : ITicketAttachmentRepository
{
    private readonly ApplicationDbContext _context;

    public TicketAttachmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TicketAttachment attachment)
    {
        await _context.TicketAttachments.AddAsync(attachment);
    }

    public async Task<List<TicketAttachment>> GetByTicketIdAsync(int ticketId)
    {
        return await _context.TicketAttachments
            .Where(x => x.TicketId == ticketId)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}