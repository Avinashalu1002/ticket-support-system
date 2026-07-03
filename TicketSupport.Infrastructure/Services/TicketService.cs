using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;
using TicketSupport.Domain.Enums;


namespace TicketSupport.Infrastructure.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;

    private readonly ITicketHistoryRepository _historyRepository;

    private readonly IEmailService _emailService;

    private readonly INotificationService _notificationService;
    

    public TicketService(
        ITicketRepository ticketRepository,
        IUserRepository userRepository,
        ITicketHistoryRepository historyRepository,
        IEmailService emailService,
        INotificationService notificationService)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _historyRepository = historyRepository;
        _emailService = emailService;
        _notificationService = notificationService;
    }

    public async Task<TicketResponseDto> CreateTicketAsync(
        CreateTicketRequestDto request)
    {
        var engineer =
            await _userRepository.GetAvailableEngineerAsync();

        var ticket = new Ticket
        {
            Title = request.Title,
            Description = request.Description,
            Category = Enum.Parse<TicketCategory>(request.Category),
            Priority = Enum.Parse<TicketPriority>(request.Priority),
            Status = TicketStatus.Open,
            CreatedByUserId = request.CreatedByUserId,
            AssignedEngineerId = engineer?.UserId,
            CreatedDate = DateTime.UtcNow
        };

        await _ticketRepository.AddAsync(ticket);
        await _ticketRepository.SaveChangesAsync();

        await _notificationService.CreateNotificationAsync(
            ticket.CreatedByUserId,
            $"Ticket #{ticket.TicketId} created successfully");
            
        var history = new TicketHistory
        {
            TicketId = ticket.TicketId,
            Status = TicketStatus.Open.ToString(),
            UpdatedDate = DateTime.UtcNow
        };

        await _historyRepository.AddAsync(history);
        await _historyRepository.SaveChangesAsync();
        if (engineer != null)
        {
            await _emailService.SendEmailAsync(
               engineer.Email,
                "New Ticket Assigned",
                $"A new ticket '{ticket.Title}' has been assigned to you.");
        }

        return new TicketResponseDto
        {
            TicketId = ticket.TicketId,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category.ToString(),
            Priority = ticket.Priority.ToString(),
            Status = ticket.Status.ToString()
        };
    }

    public async Task<List<TicketResponseDto>> GetAllTicketsAsync()
    {
        var tickets = await _ticketRepository.GetAllAsync();

        return tickets.Select(ticket => new TicketResponseDto
        {
            TicketId = ticket.TicketId,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category.ToString(),
            Priority = ticket.Priority.ToString(),
            Status = ticket.Status.ToString()
        }).ToList();
    }

    public async Task<TicketResponseDto?> GetTicketByIdAsync(int id)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);

        if (ticket == null)
            return null;
        
        var employee =
            await _userRepository.GetByIdAsync(ticket.CreatedByUserId);
        
        var engineer = ticket.AssignedEngineerId.HasValue
            ? await _userRepository.GetByIdAsync(ticket.AssignedEngineerId.Value)
            : null;

        return new TicketResponseDto
        {
            TicketId = ticket.TicketId,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category.ToString(),
            Priority = ticket.Priority.ToString(),
            Status = ticket.Status.ToString(),

            CreatedAt = ticket.CreatedDate,

            EngineerName = engineer?.Name,

            EngineerEmail = engineer?.Email,

            EngineerPhoneNumber = engineer?.PhoneNumber,

            EmployeeName = employee?.Name,
            EmployeeEmail = employee?.Email,
            EmployeePhoneNumber = employee?.PhoneNumber,
            EmployeeDepartment = employee?.Department,
            EmployeeId = employee?.EmployeeId
        };
    }

    public async Task<List<TicketResponseDto>> GetAssignedTicketsAsync(
        int engineerId)
    {
        var tickets =
            await _ticketRepository.GetAssignedTicketsAsync(
                engineerId);

        return tickets.Select(ticket => new TicketResponseDto
        {
            TicketId = ticket.TicketId,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category.ToString(),
            Priority = ticket.Priority.ToString(),
            Status = ticket.Status.ToString(),
            CreatedAt = ticket.CreatedDate
        }).ToList();
    }

    public async Task<string> StartWorkAsync(int ticketId)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId);

        if (ticket == null)
            return "Ticket not found.";

        if (ticket.Status != TicketStatus.Open)
            return "Cannot start work on a ticket that is not open.";

        ticket.Status = TicketStatus.InProgress;

        await _ticketRepository.UpdateAsync(ticket);
        await _ticketRepository.SaveChangesAsync();
        await _notificationService.CreateNotificationAsync(
            ticket.CreatedByUserId,
            $"Engineer started working on Ticket #{ticket.TicketId}");

        var history = new TicketHistory
        {
            TicketId = ticket.TicketId,
            Status = TicketStatus.InProgress.ToString(),
            UpdatedDate = DateTime.UtcNow
        };

        await _historyRepository.AddAsync(history);
        await _historyRepository.SaveChangesAsync();

        return "Work started on the ticket.";
            }

    public async Task<string> ResolveTicketAsync(int ticketId)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId);

        if (ticket == null)
        {
            return "Ticket Not Found";
        }

        ticket.Status = TicketStatus.Resolved;

        await _ticketRepository.UpdateAsync(ticket);
        await _ticketRepository.SaveChangesAsync();
        await _notificationService.CreateNotificationAsync(
            ticket.CreatedByUserId,
            $"Ticket #{ticket.TicketId} resolved successfully");

        var history = new TicketHistory
        {
            TicketId = ticket.TicketId,
            Status = TicketStatus.Resolved.ToString(),
            UpdatedDate = DateTime.UtcNow
        };

        await _historyRepository.AddAsync(history);
        await _historyRepository.SaveChangesAsync();
        await _notificationService.CreateNotificationAsync(
            ticket.CreatedByUserId,
            $"Your Ticket #{ticket.TicketId} has been resolved");

        var employee =
            await _userRepository.GetByIdAsync(
                ticket.CreatedByUserId);

        if (employee != null)
        {
            await _emailService.SendEmailAsync(
                employee.Email,
                "Ticket Resolved",
                $"Your ticket '{ticket.Title}' has been resolved successfully.");
        }

        return "Ticket Resolved Successfully";
    }

    public async Task<List<TicketResponseDto>> GetTicketsByUserIdAsync(int userId)
    {
        var tickets =
            await _ticketRepository
                .GetTicketsByUserIdAsync(userId);

        return tickets
            .Select(ticket => new TicketResponseDto
            {
                TicketId = ticket.TicketId,
                Title = ticket.Title,
                Description = ticket.Description,
                Category = ticket.Category.ToString(),
                Priority = ticket.Priority.ToString(),
                Status = ticket.Status.ToString()
            })
            .ToList();
    }

}