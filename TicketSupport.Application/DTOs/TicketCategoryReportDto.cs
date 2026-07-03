// TicketCategoryReportDto.cs
namespace TicketSupport.Application.DTOs;

public class TicketCategoryReportDto
{
    public string Category { get; set; } = string.Empty;

    public int Count { get; set; }
}