namespace TicketSupport.Application.DTOs;

public class EngineerDashboardDto
{
    public int AssignedTickets { get; set; }

    public int OpenTickets { get; set; }

    public int InProgressTickets { get; set; }

    public int ResolvedTickets { get; set; }

    public List<TicketResponseDto> RecentTickets { get; set; }
        = new();
}