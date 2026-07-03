using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            user.UserId,
            user.Name,
            user.EmployeeId,
            user.Email,
            user.PhoneNumber,
            user.Department,
            user.Role,
            user.IsActive,
            user.CreatedDate
        });
    }

    [HttpPatch("{id}/toggle-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleUserStatus(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        user.IsActive = !user.IsActive;

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return Ok(new
        {
            user.UserId,
            user.Name,
            user.IsActive,
            Message = user.IsActive
                ? "User has been enabled"
                : "User has been disabled"
        });
    }
}