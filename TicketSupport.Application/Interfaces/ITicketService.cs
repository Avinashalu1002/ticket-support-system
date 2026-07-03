using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface ITicketService
{
    Task<TicketResponseDto> CreateTicketAsync(
        CreateTicketRequestDto request);

    Task<List<TicketResponseDto>> GetAllTicketsAsync();

    Task<TicketResponseDto?> GetTicketByIdAsync(int id);

    Task<List<TicketResponseDto>> GetAssignedTicketsAsync(int engineerId);

    Task<string> StartWorkAsync(int ticketId);

    Task<string> ResolveTicketAsync(int ticketId);

    Task<List<TicketResponseDto>>GetTicketsByUserIdAsync(int userId);
}


