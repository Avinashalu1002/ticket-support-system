namespace TicketSupport.Application.DTOs;

public class CreateCommentRequestDto
{
    public int TicketId { get; set; }

    public int UserId { get; set; }

    public string Comment { get; set; } = string.Empty;
}