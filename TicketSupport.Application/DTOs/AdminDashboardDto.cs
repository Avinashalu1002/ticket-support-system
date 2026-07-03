namespace TicketSupport.Application.DTOs;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }

    public int TotalEmployees { get; set; }

    public int TotalEngineers { get; set; }

    public int TotalTickets { get; set; }

    public int OpenTickets { get; set; }

    public int InProgressTickets { get; set; }

    public int ResolvedTickets { get; set; }
}