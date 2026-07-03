using TicketSupport.Application.DTOs;

namespace TicketSupport.Application.Interfaces;

public interface IAIService
{
    Task<TicketAnalysisDto> AnalyzeTicketAsync(string description);

    Task<string> GetSuggestionsAsync(string description);
}