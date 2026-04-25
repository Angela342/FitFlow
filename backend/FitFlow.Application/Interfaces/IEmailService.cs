namespace FitFlow.Application.Interfaces;

public interface IEmailService
{
    Task SendVerificationCodeAsync(string toEmail, string toName, string code);
    Task SendPasswordResetCodeAsync(string toEmail, string toName, string code);
}
