using TicketSupport.Application.DTOs;
using TicketSupport.Application.Interfaces;
using TicketSupport.Domain.Entities;

namespace TicketSupport.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(
        INotificationRepository notificationRepository)
    {
        _notificationRepository =
            notificationRepository;
    }

    public async Task CreateNotificationAsync(
        int userId,
        string message)
    {
        var notification =
            new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedDate = DateTime.Now
            };

        await _notificationRepository.AddAsync(
            notification);
    }

    public async Task<List<NotificationDto>>
        GetUserNotificationsAsync(int userId)
    {
        var notifications =
            await _notificationRepository
                .GetByUserIdAsync(userId);

        return notifications
            .Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedDate = n.CreatedDate
            })
            .ToList();
    }
}