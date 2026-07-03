using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Enums;

namespace TicketSupport.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;

    public DashboardService(
        ITicketRepository ticketRepository,
        IUserRepository userRepository)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
    }

    public async Task<EmployeeDashboardDto>
        GetEmployeeDashboardAsync(int userId)
    {
        var tickets =
            await _ticketRepository
                .GetTicketsByUserIdAsync(userId);

        return new EmployeeDashboardDto
        {
            TotalTickets = tickets.Count,

            OpenTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Open),

            InProgressTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.InProgress),

            ResolvedTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Resolved),

            RecentTickets = tickets
                .Take(5)
                .Select(ticket =>
                    new TicketResponseDto
                    {
                        TicketId = ticket.TicketId,
                        Title = ticket.Title,
                        Description = ticket.Description,
                        Category = ticket.Category.ToString(),
                        Priority = ticket.Priority.ToString(),
                        Status = ticket.Status.ToString()
                    })
                .ToList()
        };
    }

    public async Task<EngineerDashboardDto>
        GetEngineerDashboardAsync(int engineerId)
    {
        var tickets =
            await _ticketRepository
                .GetAssignedTicketsAsync(engineerId);

        return new EngineerDashboardDto
        {
            AssignedTickets = tickets.Count,

            OpenTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Open),

            InProgressTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.InProgress),

            ResolvedTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Resolved),

            RecentTickets = tickets
                .Take(5)
                .Select(ticket =>
                    new TicketResponseDto
                    {
                        TicketId = ticket.TicketId,
                        Title = ticket.Title,
                        Description = ticket.Description,
                        Category = ticket.Category.ToString(),
                        Priority = ticket.Priority.ToString(),
                        Status = ticket.Status.ToString()
                    })
                .ToList()
        };
    }

        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        var users =
            await _userRepository.GetAllUsersAsync();

        var tickets =
            await _ticketRepository.GetAllAsync();

        return new AdminDashboardDto
        {
            TotalUsers = users.Count,

            TotalEmployees =
                users.Count(x => x.Role == "Employee"),

            TotalEngineers =
                users.Count(x => x.Role == "Engineer"),

            TotalTickets = tickets.Count,

            OpenTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Open),

            InProgressTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.InProgress),

            ResolvedTickets =
                tickets.Count(x =>
                    x.Status == TicketStatus.Resolved)
        };
    }
}