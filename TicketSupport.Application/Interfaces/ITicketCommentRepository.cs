using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface ITicketCommentRepository
{
    Task AddAsync(TicketComment comment);

    Task<List<TicketComment>> GetByTicketIdAsync(int ticketId);

    Task SaveChangesAsync();
}