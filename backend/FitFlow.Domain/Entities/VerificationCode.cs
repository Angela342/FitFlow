using FitFlow.Domain.Enums;

namespace FitFlow.Domain.Entities;

public class VerificationCode : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public VerificationPurpose Purpose { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
}
