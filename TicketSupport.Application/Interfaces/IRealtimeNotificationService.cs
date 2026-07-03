namespace TicketSupport.Application.Interfaces;

public interface IRealtimeNotificationService
{
    Task SendToUserAsync(
        string userId,
        string message);
}