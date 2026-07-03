using TicketSupport.Domain.Entities;

namespace TicketSupport.Application.Interfaces;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);

    Task<List<Notification>> GetByUserIdAsync(int userId);
}