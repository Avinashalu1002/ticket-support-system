using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzeTicket(
        AnalyzeTicketRequestDto request)
    {
        var result =
            await _aiService.AnalyzeTicketAsync(
                request.Description);

        return Ok(result);
    }

    [HttpPost("suggestions")]
    public async Task<IActionResult> GetSuggestions(
        AnalyzeTicketRequestDto request)
    {
        var result =
            await _aiService.GetSuggestionsAsync(
                request.Description);

        return Ok(result);
    }
}