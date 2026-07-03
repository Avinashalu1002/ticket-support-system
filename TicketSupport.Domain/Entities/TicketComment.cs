namespace TicketSupport.Domain.Entities;

public class TicketComment
{
    public int CommentId { get; set; }

    public int TicketId { get; set; }

    public int UserId { get; set; }

    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
}