using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface ITicketHistoryRepository
{
    Task AddAsync(TicketHistory history);

    Task<List<TicketHistory>> GetByTicketIdAsync(int ticketId);

    Task SaveChangesAsync();
}