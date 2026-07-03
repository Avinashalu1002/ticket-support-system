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
                    content = @"You are an IT Support Assistant for an internal help desk.

    RULES:
    1. If the user greets you (hi, hello, hey, good morning, etc.), reply with a short friendly greeting and ask what IT issue they need help with. Do not give troubleshooting steps for a greeting.
    2. If the message is a genuine IT/technical issue (hardware, software, network, printer, email, VPN, WiFi, laptop, etc.), give EXACTLY 3 to 4 short troubleshooting steps, formatted as:
    Step 1: [one short action]
    Step 2: [one short action]
    Step 3: [one short action]
    Step 4: [one short action, only if truly needed]
    Each step must be a single short sentence — no sub-bullets, no long explanations, no extra text before or after the steps.
    3. If the message is unrelated to IT support (personal questions, general chit-chat, unrelated topics), politely reply that you can only help with IT support issues, and do not attempt to answer it.
    4. Never return more than 4 steps. Never write more than 1 sentence per step.
    5. Return plain text only. No JSON, no markdown formatting, no code blocks, no asterisks."
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
            .Replace("```", "")
            .Trim();

        Console.WriteLine("===== AI SUGGESTIONS TEXT =====");
        Console.WriteLine(aiText);

        return aiText;
    }
}