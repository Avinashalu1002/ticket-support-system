using TicketSupport.Application.DTOs;
namespace TicketSupport.Application.Interfaces;

public interface INotificationService
{
    Task CreateNotificationAsync(
        int userId,
        string message);

    Task<List<NotificationDto>> GetUserNotificationsAsync(
    int userId);
}