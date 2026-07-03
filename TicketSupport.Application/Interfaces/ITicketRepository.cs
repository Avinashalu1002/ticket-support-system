using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface ITicketRepository
{
    Task AddAsync(Ticket ticket);

    Task<List<Ticket>> GetAllAsync();

    Task<Ticket?> GetByIdAsync(int id);

    Task<List<Ticket>> GetAssignedTicketsAsync(int engineerId);

    Task<List<Ticket>> GetTicketsByUserIdAsync(int userId);

    Task UpdateAsync(Ticket ticket);

    Task SaveChangesAsync();
}