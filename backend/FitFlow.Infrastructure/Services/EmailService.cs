using FitFlow.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FitFlow.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _fromAddress;
    private readonly string _fromName;

    public EmailService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _http = httpClientFactory.CreateClient("Resend");
        _apiKey = configuration["Resend:ApiKey"]
            ?? throw new InvalidOperationException("Resend:ApiKey is not configured.");
        _fromAddress = configuration["Resend:FromAddress"] ?? "onboarding@resend.dev";
        _fromName = configuration["Resend:FromName"] ?? "FitFlow";
    }

    public Task SendVerificationCodeAsync(string toEmail, string toName, string code) =>
        SendAsync(
            to: toEmail,
            subject: "Verify your FitFlow account",
            html: BuildEmailHtml(
                title: "Verify your email",
                intro: $"Hi {toName}, welcome to FitFlow! Use the code below to verify your email address.",
                code: code,
                note: "This code expires in 15 minutes."
            )
        );

    public Task SendPasswordResetCodeAsync(string toEmail, string toName, string code) =>
        SendAsync(
            to: toEmail,
            subject: "Reset your FitFlow password",
            html: BuildEmailHtml(
                title: "Reset your password",
                intro: $"Hi {toName}, use the code below to reset your FitFlow password.",
                code: code,
                note: "This code expires in 15 minutes. If you didn't request this, you can safely ignore this email."
            )
        );

    private async Task SendAsync(string to, string subject, string html)
    {
        var payload = new
        {
            from = $"{_fromName} <{_fromAddress}>",
            to = new[] { to },
            subject,
            html
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            )
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Resend API error {response.StatusCode}: {body}");
        }
    }

    private static string BuildEmailHtml(string title, string intro, string code, string note) => $"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9f9f9;padding:40px 0;margin:0;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,.06);">
            <h1 style="font-size:22px;font-weight:600;color:#111;margin:0 0 8px;">{title}</h1>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 32px;">{intro}</p>
            <div style="background:linear-gradient(135deg,#fce7f0,#f3eaf8);border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
              <span style="font-size:40px;font-weight:800;letter-spacing:10px;color:#D4698A;">{code}</span>
            </div>
            <p style="color:#999;font-size:13px;margin:0;">{note}</p>
            <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0;"/>
            <p style="color:#ccc;font-size:12px;margin:0;">© {DateTime.UtcNow.Year} FitFlow. All rights reserved.</p>
          </div>
        </body>
        </html>
        """;
}
