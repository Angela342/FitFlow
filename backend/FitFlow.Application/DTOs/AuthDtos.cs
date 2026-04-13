namespace FitFlow.Application.DTOs;

public record RegisterDto(string Name, string Email, string Password, string? Phone = null);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string UserId, string Name, string Email, string Role);
