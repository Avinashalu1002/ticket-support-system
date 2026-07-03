using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result =
            await _adminService.GetAllUsersAsync();

        return Ok(result);
    }

    [HttpPut("users/{userId}/status")]
    public async Task<IActionResult>
        ToggleUserStatus(int userId)
    {
        var result =
            await _adminService
                .ToggleUserStatusAsync(userId);

        return Ok(result);
    }
}