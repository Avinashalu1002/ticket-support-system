using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface IDashboardService
{
    Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(int userId);
    
    Task<EngineerDashboardDto> GetEngineerDashboardAsync(int engineerId);

    Task<AdminDashboardDto> GetAdminDashboardAsync();
}