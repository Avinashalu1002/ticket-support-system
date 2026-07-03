using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.Infrastructure.Services;

public class TicketHistoryService : ITicketHistoryService
{
    private readonly ITicketHistoryRepository _historyRepository;

    public TicketHistoryService(
        ITicketHistoryRepository historyRepository)
    {
        _historyRepository = historyRepository;
    }

    public async Task<List<TicketHistoryDto>>
        GetHistoryByTicketIdAsync(int ticketId)
    {
        var histories =
            await _historyRepository
                .GetByTicketIdAsync(ticketId);

        return histories.Select(history =>
            new TicketHistoryDto
            {
                HistoryId = history.HistoryId,
                TicketId = history.TicketId,
                Status = history.Status,
                UpdatedDate = history.UpdatedDate
            }).ToList();
    }
}