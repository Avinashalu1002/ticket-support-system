
using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;

namespace TicketSupport.Infrastructure.Services;

public class TicketAttachmentService : ITicketAttachmentService
{
    private readonly ITicketAttachmentRepository _repository;

    public TicketAttachmentService(
        ITicketAttachmentRepository repository)
    {
        _repository = repository;
    }

        public async Task<string> UploadFileAsync(
        int ticketId,
        string fileName,
        Stream fileStream)
    {
        var uploadsFolder =
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "Uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName =
            Guid.NewGuid() + "_" + fileName;

        var filePath =
            Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream =
            new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        var attachment = new TicketAttachment
        {
            TicketId = ticketId,
            FileName = fileName,
            FilePath = filePath,
            UploadedDate = DateTime.UtcNow
        };

        await _repository.AddAsync(attachment);
        await _repository.SaveChangesAsync();
        return "File Uploaded Successfully";
    }

    public async Task<List<TicketAttachmentDto>>
        GetAttachmentsAsync(int ticketId)
    {
        var attachments =
            await _repository.GetByTicketIdAsync(ticketId);

        return attachments.Select(x =>
            new TicketAttachmentDto
            {
                AttachmentId = x.AttachmentId,
                TicketId = x.TicketId,
                FileName = x.FileName,
                FilePath = x.FilePath,
                UploadedDate = x.UploadedDate
            }).ToList();
    }
}