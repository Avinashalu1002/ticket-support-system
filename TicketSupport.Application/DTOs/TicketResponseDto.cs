namespace TicketSupport.Application.DTOs;

public class TicketResponseDto
{
    public int TicketId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string? EngineerName { get; set; }

    public string? EngineerEmail { get; set; }

    public string? EngineerPhoneNumber { get; set; }

    public string? EmployeeName { get; set; }

    public string? EmployeeEmail { get; set; }

    public string? EmployeePhoneNumber { get; set; }

    public string? EmployeeDepartment { get; set; }

    public string? EmployeeId { get; set; }
}