using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestEmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public TestEmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail(string toEmail)
    {
        await _emailService.SendEmailAsync(
            toEmail,
            "Ticket Support Test Email",
            "Congratulations! Email service is working successfully.");

        return Ok("Email Sent Successfully");
    }
}