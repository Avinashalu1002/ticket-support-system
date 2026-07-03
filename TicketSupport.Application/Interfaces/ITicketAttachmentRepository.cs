using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface ITicketAttachmentRepository
{
    Task AddAsync(TicketAttachment attachment);

    Task<List<TicketAttachment>> GetByTicketIdAsync(int ticketId);

    Task SaveChangesAsync();
}