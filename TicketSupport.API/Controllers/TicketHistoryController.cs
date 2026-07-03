using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketHistoryController : ControllerBase
{
    private readonly ITicketHistoryService _historyService;

    public TicketHistoryController(
        ITicketHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet("{ticketId}")]
    public async Task<IActionResult> GetHistory(int ticketId)
    {
        var result =
            await _historyService
                .GetHistoryByTicketIdAsync(ticketId);

        return Ok(result);
    }
}