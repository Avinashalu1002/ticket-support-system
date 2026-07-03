namespace TicketSupport.Application.DTOs;

public class EngineerPerformanceDto
{
    public string EngineerName { get; set; } = string.Empty;

    public int AssignedTickets { get; set; }

    public int ResolvedTickets { get; set; }
}