namespace FitFlow.Application.Interfaces;

public interface ISmsService
{
    /// <summary>Returns false if SMS is not configured (Twilio credentials missing).</summary>
    Task<bool> SendVerificationCodeAsync(string phone, string code);
    Task<bool> SendPasswordResetCodeAsync(string phone, string code);
}
