using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(
        IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("priority")]
    public async Task<IActionResult>
        GetTicketsByPriority()
    {
        var result =
            await _reportService
                .GetTicketsByPriorityAsync();

        return Ok(result);
    }

    [HttpGet("engineers")]
    public async Task<IActionResult>
        GetEngineerPerformance()
    {
        var result =
            await _reportService
                .GetEngineerPerformanceAsync();

        return Ok(result);
    }

    [HttpGet("category")]
    public async Task<IActionResult>
        GetTicketsByCategory()
    {
        var result =
            await _reportService
                .GetTicketsByCategoryAsync();

        return Ok(result);
    }

    [HttpGet("monthly")]
    public async Task<IActionResult>
        GetMonthlyReport()
    {
        var result =
            await _reportService
                .GetMonthlyTicketReportAsync();

        return Ok(result);
    }
}
