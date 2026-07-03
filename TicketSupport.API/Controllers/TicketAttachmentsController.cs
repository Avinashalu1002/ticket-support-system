using Microsoft.AspNetCore.Mvc;
using TicketSupport.Application.Interfaces;

namespace TicketSupport.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketAttachmentsController : ControllerBase
{
    private readonly ITicketAttachmentService _attachmentService;

    public TicketAttachmentsController(
        ITicketAttachmentService attachmentService)
    {
        _attachmentService = attachmentService;
    }

    [HttpPost("upload/{ticketId}")]
    public async Task<IActionResult> UploadFile(
        int ticketId,
        IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file selected.");
        }

        using var stream = file.OpenReadStream();

        var result =
            await _attachmentService.UploadFileAsync(
                ticketId,
                file.FileName,
                stream);

        return Ok(result);
    }

    [HttpGet("{ticketId}")]
    public async Task<IActionResult> GetAttachments(
        int ticketId)
    {
        var result =
            await _attachmentService
                .GetAttachmentsAsync(ticketId);

        return Ok(result);
    }
}