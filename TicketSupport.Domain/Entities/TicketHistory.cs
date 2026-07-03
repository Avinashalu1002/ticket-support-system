public class TicketHistory
{
    public int HistoryId { get; set; }

    public int TicketId { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime UpdatedDate { get; set; }
}