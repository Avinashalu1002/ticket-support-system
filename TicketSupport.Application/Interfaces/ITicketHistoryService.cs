using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface ITicketHistoryService
{
    Task<List<TicketHistoryDto>> GetHistoryByTicketIdAsync(int ticketId);
}