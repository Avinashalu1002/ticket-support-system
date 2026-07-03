using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface IReportService
{
    Task<List<TicketPriorityReportDto>>
        GetTicketsByPriorityAsync();

    Task<List<EngineerPerformanceDto>>
        GetEngineerPerformanceAsync();

    Task<List<TicketCategoryReportDto>>
        GetTicketsByCategoryAsync();

    Task<List<MonthlyTicketReportDto>>
        GetMonthlyTicketReportAsync();

  
}