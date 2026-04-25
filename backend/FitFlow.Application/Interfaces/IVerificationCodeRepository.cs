using FitFlow.Domain.Entities;
using FitFlow.Domain.Enums;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IVerificationCodeRepository : IRepository<VerificationCode>
{
    Task<VerificationCode?> GetActiveCodeAsync(string email, VerificationPurpose purpose);
    Task InvalidatePreviousCodesAsync(string email, VerificationPurpose purpose);
}
