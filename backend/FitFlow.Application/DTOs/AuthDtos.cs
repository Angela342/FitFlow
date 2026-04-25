namespace FitFlow.Application.DTOs;

public record RegisterDto(string Name, string Email, string Password, string? Phone = null);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string UserId, string Name, string Email, string Role);

// Returned when the user must verify their email before receiving a token
public record RegisterResponseDto(string Email, bool RequiresVerification, bool SmsSent, string Message);
