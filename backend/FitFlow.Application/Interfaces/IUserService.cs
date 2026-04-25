using FitFlow.Application.DTOs;

namespace FitFlow.Application.Interfaces;

public interface IUserService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<VerifyEmailResponseDto> VerifyEmailAsync(VerifyEmailDto dto);
    Task<VerificationSentDto> ResendVerificationAsync(SendVerificationDto dto);
    Task<VerificationSentDto> ForgotPasswordAsync(ForgotPasswordDto dto);
    Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto dto);
}
