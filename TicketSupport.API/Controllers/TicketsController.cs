using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }
    
    [Authorize(Roles = "Employee")]
    [HttpPost]
    public async Task<IActionResult> CreateTicket(
        CreateTicketRequestDto request)
    {
        var result =
            await _ticketService.CreateTicketAsync(request);

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTickets()
    {
        var result =
            await _ticketService.GetAllTicketsAsync();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicketById(int id)
    {
        var result =
            await _ticketService.GetTicketByIdAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
    
    [Authorize(Roles = "Engineer")]
    [HttpGet("assigned/{engineerId}")]
    public async Task<IActionResult> GetAssignedTickets(int engineerId)
    {
        var result =
            await _ticketService.GetAssignedTicketsAsync(engineerId);

        return Ok(result);
    }

    [HttpPut("{ticketId}/start")]
    public async Task<IActionResult> StartWork(int ticketId)
    {
        var result =
            await _ticketService.StartWorkAsync(ticketId);

        return Ok(result);
    }
    
    [Authorize(Roles = "Engineer")]
    [HttpPut("{ticketId}/resolve")]
    public async Task<IActionResult> ResolveTicket(int ticketId)
    {
        var result =
            await _ticketService.ResolveTicketAsync(ticketId);

        return Ok(result);
    }

    [Authorize(Roles = "Employee")]
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserTickets(int userId)
    {
        var result =
            await _ticketService.GetTicketsByUserIdAsync(userId);

        return Ok(result);
    }
}
