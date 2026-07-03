using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("employee/{userId}")]
    public async Task<IActionResult> GetEmployeeDashboard(
        int userId)
    {
        var result =
            await _dashboardService
                .GetEmployeeDashboardAsync(userId);

        return Ok(result);
    }

    [HttpGet("engineer/{engineerId}")]
    public async Task<IActionResult> GetEngineerDashboard(
        int engineerId)
    {
        var result =
            await _dashboardService
                .GetEngineerDashboardAsync(engineerId);

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var result =
            await _dashboardService
                .GetAdminDashboardAsync();

        return Ok(result);
    }
}