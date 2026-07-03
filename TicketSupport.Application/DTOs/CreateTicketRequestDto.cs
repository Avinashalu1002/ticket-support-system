namespace TicketSupport.Application.DTOs;

public class CreateTicketRequestDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }
}