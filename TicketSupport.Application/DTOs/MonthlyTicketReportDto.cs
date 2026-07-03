namespace TicketSupport.Application.DTOs;

public class MonthlyTicketReportDto
{
    public string Month { get; set; } = string.Empty;

    public int TicketCount { get; set; }
}