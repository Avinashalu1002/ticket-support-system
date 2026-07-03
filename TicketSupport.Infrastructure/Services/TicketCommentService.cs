using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;

namespace TicketSupport.Infrastructure.Services;

public class TicketCommentService : ITicketCommentService
{
    private readonly ITicketCommentRepository _commentRepository;

    private readonly ITicketRepository _ticketRepository;

    private readonly IUserRepository _userRepository;

    private readonly INotificationService _notificationService;

    public TicketCommentService(
        ITicketCommentRepository commentRepository,
        ITicketRepository ticketRepository,
        IUserRepository userRepository,
        INotificationService notificationService)
    {
        _commentRepository = commentRepository;

        _ticketRepository = ticketRepository;

        _userRepository = userRepository;

        _notificationService = notificationService;
    }

    public async Task<CommentResponseDto> AddCommentAsync(
        CreateCommentRequestDto request)
    {
        var comment = new TicketComment
        {
            TicketId = request.TicketId,
            UserId = request.UserId,
            Comment = request.Comment,
            CreatedDate = DateTime.UtcNow
        };

        await _commentRepository.AddAsync(comment);

        await _commentRepository.SaveChangesAsync();

        var ticket =
            await _ticketRepository
                .GetByIdAsync(request.TicketId);

        if (ticket != null)
        {
            // Employee added comment

            if (request.UserId ==
                ticket.CreatedByUserId)
            {
                if (ticket.AssignedEngineerId != null)
                {
                    await _notificationService
                        .CreateNotificationAsync(
                            ticket.AssignedEngineerId.Value,
                            $"New comment added on Ticket #{ticket.TicketId}");
                }
            }
            else
            {
                // Engineer added comment

                await _notificationService
                    .CreateNotificationAsync(
                        ticket.CreatedByUserId,
                        $"Engineer commented on Ticket #{ticket.TicketId}");
            }
        }

        return new CommentResponseDto
        {
            CommentId = comment.CommentId,
            TicketId = comment.TicketId,
            UserId = comment.UserId,
            Comment = comment.Comment,
            CreatedDate = comment.CreatedDate
        };
    }

    public async Task<List<CommentResponseDto>>
        GetCommentsByTicketIdAsync(int ticketId)
    {
        var comments =
            await _commentRepository
                .GetByTicketIdAsync(ticketId);

        return comments
            .Select(comment =>
                new CommentResponseDto
                {
                    CommentId = comment.CommentId,
                    TicketId = comment.TicketId,
                    UserId = comment.UserId,
                    Comment = comment.Comment,
                    CreatedDate = comment.CreatedDate
                })
            .ToList();
    }
}