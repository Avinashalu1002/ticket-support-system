using TicketSupport.Domain.Enums;

namespace TicketSupport.Domain.Entities;

public class Ticket
{
    public int TicketId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TicketCategory Category { get; set; }

    public TicketPriority Priority { get; set; }

    public TicketStatus Status { get; set; }

    public int CreatedByUserId { get; set; }

    public int? AssignedEngineerId { get; set; }

    public string? AttachmentPath { get; set; }

    public DateTime CreatedDate { get; set; }
        = DateTime.UtcNow;

    public DateTime? UpdatedDate { get; set; }
}