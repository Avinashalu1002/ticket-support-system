using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketCommentsController : ControllerBase
{
    private readonly ITicketCommentService _commentService;

    public TicketCommentsController(
        ITicketCommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost]
    public async Task<IActionResult> AddComment(
        CreateCommentRequestDto request)
    {
        var result =
            await _commentService.AddCommentAsync(request);

        return Ok(result);
    }

    [HttpGet("{ticketId}")]
    public async Task<IActionResult> GetComments(
        int ticketId)
    {
        var result =
            await _commentService
                .GetCommentsByTicketIdAsync(ticketId);

        return Ok(result);
    }
}