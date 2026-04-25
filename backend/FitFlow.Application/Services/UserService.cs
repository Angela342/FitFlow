using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Domain.Enums;

namespace FitFlow.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IVerificationCodeRepository _verificationCodeRepository;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public UserService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        IVerificationCodeRepository verificationCodeRepository,
        IEmailService emailService,
        ISmsService smsService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _verificationCodeRepository = verificationCodeRepository;
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant());
        if (existing != null)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            Email = dto.Email.ToLowerInvariant(),
            Name = dto.Name,
            Phone = dto.Phone,
            PasswordHash = _passwordHasher.Hash(dto.Password),
        };

        await _userRepository.AddAsync(user);

        // Send verification code
        var (code, smsSent) = await SendCodeAsync(user, VerificationPurpose.EmailVerification);

        return new RegisterResponseDto(
            Email: user.Email,
            RequiresVerification: true,
            SmsSent: smsSent,
            Message: smsSent
                ? $"A verification code has been sent to {user.Email} and your phone."
                : $"A verification code has been sent to {user.Email}."
        );
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant());

        if (user == null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("This account has been disabled.");

        // If email not verified, resend a code and tell the frontend
        if (!user.IsEmailVerified)
            throw new EmailNotVerifiedException(user.Email, user.Phone);

        var token = _jwtService.GenerateAccessToken(user);

        return new AuthResponseDto(
            Token: token,
            UserId: user.Id.ToString(),
            Name: user.Name,
            Email: user.Email,
            Role: user.Role.ToString()
        );
    }

    public async Task<VerifyEmailResponseDto> VerifyEmailAsync(VerifyEmailDto dto)
    {
        var code = await _verificationCodeRepository.GetActiveCodeAsync(
            dto.Email.ToLowerInvariant(), VerificationPurpose.EmailVerification);

        if (code == null || code.Code != dto.Code)
            throw new InvalidOperationException("Invalid or expired verification code.");

        // Mark code as used
        code.IsUsed = true;
        await _verificationCodeRepository.UpdateAsync(code);

        // Activate the user
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant())
            ?? throw new InvalidOperationException("User not found.");

        user.IsEmailVerified = true;
        await _userRepository.UpdateAsync(user);

        var token = _jwtService.GenerateAccessToken(user);

        return new VerifyEmailResponseDto(
            Token: token,
            UserId: user.Id.ToString(),
            Name: user.Name,
            Email: user.Email,
            Role: user.Role.ToString()
        );
    }

    public async Task<VerificationSentDto> ResendVerificationAsync(SendVerificationDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant())
            ?? throw new InvalidOperationException("No account found with this email.");

        if (user.IsEmailVerified)
            throw new InvalidOperationException("This account is already verified.");

        var (_, smsSent) = await SendCodeAsync(user, VerificationPurpose.EmailVerification);

        return new VerificationSentDto(
            Email: user.Email,
            SmsSent: smsSent,
            Message: smsSent
                ? $"Code resent to {user.Email} and your phone."
                : $"Code resent to {user.Email}."
        );
    }

    public async Task<VerificationSentDto> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant());

        // Always return success to prevent email enumeration
        if (user == null)
            return new VerificationSentDto(dto.Email, false,
                "If an account exists with this email, a reset code has been sent.");

        var (_, smsSent) = await SendCodeAsync(user, VerificationPurpose.PasswordReset);

        return new VerificationSentDto(
            Email: user.Email,
            SmsSent: smsSent,
            Message: smsSent
                ? $"A reset code has been sent to {user.Email} and your phone."
                : $"A reset code has been sent to {user.Email}."
        );
    }

    public async Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var code = await _verificationCodeRepository.GetActiveCodeAsync(
            dto.Email.ToLowerInvariant(), VerificationPurpose.PasswordReset);

        if (code == null || code.Code != dto.Code)
            throw new InvalidOperationException("Invalid or expired reset code.");

        code.IsUsed = true;
        await _verificationCodeRepository.UpdateAsync(code);

        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant())
            ?? throw new InvalidOperationException("User not found.");

        user.PasswordHash = _passwordHasher.Hash(dto.NewPassword);
        await _userRepository.UpdateAsync(user);

        return new ResetPasswordResponseDto("Password reset successfully. You can now sign in.");
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private async Task<(string code, bool smsSent)> SendCodeAsync(User user, VerificationPurpose purpose)
    {
        // Invalidate any existing codes for this email + purpose
        await _verificationCodeRepository.InvalidatePreviousCodesAsync(user.Email, purpose);

        var code = GenerateCode();

        await _verificationCodeRepository.AddAsync(new VerificationCode
        {
            Email = user.Email,
            Code = code,
            Purpose = purpose,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
        });

        // Send email
        if (purpose == VerificationPurpose.EmailVerification)
            await _emailService.SendVerificationCodeAsync(user.Email, user.Name, code);
        else
            await _emailService.SendPasswordResetCodeAsync(user.Email, user.Name, code);

        // Optionally send SMS if phone is available
        bool smsSent = false;
        if (!string.IsNullOrWhiteSpace(user.Phone))
        {
            smsSent = purpose == VerificationPurpose.EmailVerification
                ? await _smsService.SendVerificationCodeAsync(user.Phone, code)
                : await _smsService.SendPasswordResetCodeAsync(user.Phone, code);
        }

        return (code, smsSent);
    }

    private static string GenerateCode() =>
        Random.Shared.Next(100_000, 999_999).ToString();
}

/// <summary>Thrown when a login is attempted but the email is not yet verified.</summary>
public class EmailNotVerifiedException : Exception
{
    public string Email { get; }
    public string? Phone { get; }

    public EmailNotVerifiedException(string email, string? phone)
        : base("Email address has not been verified.")
    {
        Email = email;
        Phone = phone;
    }
}
