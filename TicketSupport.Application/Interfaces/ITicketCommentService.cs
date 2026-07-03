using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface ITicketCommentService
{
    Task<CommentResponseDto> AddCommentAsync(
        CreateCommentRequestDto request);

    Task<List<CommentResponseDto>> GetCommentsByTicketIdAsync(
        int ticketId);
}