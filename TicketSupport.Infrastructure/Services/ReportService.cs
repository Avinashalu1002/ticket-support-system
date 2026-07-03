using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Enums;

namespace TicketSupport.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;

    public ReportService(
        ITicketRepository ticketRepository,
        IUserRepository userRepository)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
    }

    public async Task<List<TicketPriorityReportDto>>
        GetTicketsByPriorityAsync()
    {
        var tickets =
            await _ticketRepository.GetAllAsync();

        return Enum.GetValues<TicketPriority>()
            .Select(priority =>
                new TicketPriorityReportDto
                {
                    Priority = priority.ToString(),
                    Count =
                        tickets.Count(x =>
                            x.Priority == priority)
                })
            .ToList();
    }

    public async Task<List<EngineerPerformanceDto>>
        GetEngineerPerformanceAsync()
    {
        var users =
            await _userRepository.GetAllUsersAsync();

        var engineers =
            users.Where(x => x.Role == "Engineer")
                 .ToList();

        var tickets =
            await _ticketRepository.GetAllAsync();

        return engineers.Select(engineer =>
            new EngineerPerformanceDto
            {
                EngineerName = engineer.Name,

                AssignedTickets =
                    tickets.Count(x =>
                        x.AssignedEngineerId ==
                        engineer.UserId),

                ResolvedTickets =
                    tickets.Count(x =>
                        x.AssignedEngineerId ==
                        engineer.UserId &&
                        x.Status ==
                        TicketStatus.Resolved)
            })
            .ToList();
    }

    public async Task<List<TicketCategoryReportDto>>
        GetTicketsByCategoryAsync()
    {
        var tickets =
            await _ticketRepository.GetAllAsync();

        return Enum.GetValues<TicketCategory>()
            .Select(category =>
                new TicketCategoryReportDto
                {
                    Category = category.ToString(),
                    Count =
                        tickets.Count(x =>
                            x.Category == category)
                })
            .ToList();
    }

    public async Task<List<MonthlyTicketReportDto>>
        GetMonthlyTicketReportAsync()
    {
        var tickets =
            await _ticketRepository.GetAllAsync();

        return tickets
            .GroupBy(x => new
            {
                x.CreatedDate.Year,
                x.CreatedDate.Month
            })
            .Select(group =>
                new MonthlyTicketReportDto
                {
                    Month =
                        $"{group.Key.Month}/{group.Key.Year}",

                    TicketCount = group.Count()
                })
            .OrderBy(x => x.Month)
            .ToList();
    }
}