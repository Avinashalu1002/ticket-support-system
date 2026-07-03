namespace TicketSupport.Domain.Entities;

public class TicketAttachment
{
    public int AttachmentId { get; set; }

    public int TicketId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string FilePath { get; set; } = string.Empty;

    public DateTime UploadedDate { get; set; }
}