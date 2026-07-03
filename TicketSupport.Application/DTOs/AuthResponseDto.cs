namespace TicketSupport.Application.DTOs;

public class AuthResponseDto
{
    public string Message { get; set; } = string.Empty;

    public string? Token { get; set; }

    public string? Role { get; set; }
}