using System.Text;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;
using TicketSupport.Application.Interfaces;
using TicketSupport.Application.DTOs;
using TicketSupport.Infrastructure.Settings;

namespace TicketSupport.Infrastructure.Services;

public class GroqService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly GroqSettings _settings;

    public GroqService(
        HttpClient httpClient,
        IOptions<GroqSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

   public async Task<TicketAnalysisDto> AnalyzeTicketAsync(string description)
    {
        var requestBody = new
        {
            model = "llama-3.3-70b-versatile",
            messages = new[]
            {
                new
                {
                    role = "system",
                    content = @"You are an IT Support AI.

    Analyze the ticket and return ONLY JSON:

    {
    ""Category"": ""Hardware|Software|Network"",
    ""Priority"": ""Low|Medium|High""
    }"
                },
                new
                {
                    role = "user",
                    content = description
                }
            }
        };

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.groq.com/openai/v1/chat/completions");

        request.Headers.Add(
            "Authorization",
            $"Bearer {_settings.ApiKey}");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestBody),
            Encoding.UTF8,
            "application/json");

        var response =
            await _httpClient.SendAsync(request);

        var content =
            await response.Content.ReadAsStringAsync();

        Console.WriteLine("===== GROQ RESPONSE =====");
        Console.WriteLine(content);

        dynamic? groqResponse =
            JsonConvert.DeserializeObject(content);

        if (groqResponse == null || groqResponse.choices == null)
        {
            throw new Exception(
                $"Groq API Error: {content}");
        }

        string aiText =
            groqResponse.choices[0].message.content.ToString();

        aiText = aiText
            .Replace("```json", "")
            .Replace("```", "")
            .Trim();

        Console.WriteLine("===== AI TEXT =====");
        Console.WriteLine(aiText);

        var result =
            JsonConvert.DeserializeObject<TicketAnalysisDto>(aiText);

        if (result == null)
        {
            throw new Exception(
                $"Unable to parse AI response: {aiText}");
        }

        return result;
    }

    public async Task<string> GetSuggestionsAsync(string description)
    {
        var requestBody = new
        {
            model = "llama-3.3-70b-versatile",
            messages = new[]
            {
                new
                {
                    role = "system",
                    content = @"You are an IT Support Engineer.

Provide 5 troubleshooting suggestions for the user's issue.

Return only plain text."
                },
                new
                {
                    role = "user",
                    content = description
                }
            }
        };

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.groq.com/openai/v1/chat/completions");

        request.Headers.Add(
            "Authorization",
            $"Bearer {_settings.ApiKey}");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestBody),
            Encoding.UTF8,
            "application/json");

        var response =
            await _httpClient.SendAsync(request);

       var content =
            await response.Content.ReadAsStringAsync();

        Console.WriteLine("===== GROQ SUGGESTIONS RESPONSE =====");
        Console.WriteLine(content);

        return content;
    }
}