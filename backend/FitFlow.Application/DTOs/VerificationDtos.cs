namespace FitFlow.Application.DTOs;

// Request DTOs
public record SendVerificationDto(string Email);
public record VerifyEmailDto(string Email, string Code);
public record ForgotPasswordDto(string Email);
public record VerifyResetCodeDto(string Email, string Code);
public record ResetPasswordDto(string Email, string Code, string NewPassword);

// Response DTOs
public record VerificationSentDto(string Email, bool SmsSent, string Message);
public record VerifyEmailResponseDto(string Token, string UserId, string Name, string Email, string Role);
public record ResetPasswordResponseDto(string Message);
