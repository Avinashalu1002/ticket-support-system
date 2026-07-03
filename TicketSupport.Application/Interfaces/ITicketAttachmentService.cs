using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface ITicketAttachmentService
{
    Task<string> UploadFileAsync(
        int ticketId,
        string fileName,
        Stream fileStream);

    Task<List<TicketAttachmentDto>>
        GetAttachmentsAsync(int ticketId);
}