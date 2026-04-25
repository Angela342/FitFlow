using FitFlow.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;

namespace FitFlow.Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? _accountSid;
    private readonly string? _authToken;
    private readonly string? _fromNumber;
    private readonly bool _isConfigured;

    public SmsService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
        _accountSid = configuration["Twilio:AccountSid"];
        _authToken = configuration["Twilio:AuthToken"];
        _fromNumber = configuration["Twilio:FromNumber"];
        _isConfigured = !string.IsNullOrWhiteSpace(_accountSid)
                     && !string.IsNullOrWhiteSpace(_authToken)
                     && !string.IsNullOrWhiteSpace(_fromNumber);
    }

    public Task<bool> SendVerificationCodeAsync(string phone, string code) =>
        SendAsync(phone, $"Your FitFlow verification code is: {code}. It expires in 15 minutes.");

    public Task<bool> SendPasswordResetCodeAsync(string phone, string code) =>
        SendAsync(phone, $"Your FitFlow password reset code is: {code}. It expires in 15 minutes.");

    private async Task<bool> SendAsync(string to, string body)
    {
        if (!_isConfigured) return false;

        var http = _httpClientFactory.CreateClient("Twilio");
        var url = $"https://api.twilio.com/2010-04-01/Accounts/{_accountSid}/Messages.json";

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["To"] = to,
            ["From"] = _fromNumber!,
            ["Body"] = body
        });

        var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_accountSid}:{_authToken}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        var response = await http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
