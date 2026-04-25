using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Domain.Enums;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class VerificationCodeRepository : BaseRepository<VerificationCode>, IVerificationCodeRepository
{
    public VerificationCodeRepository(AppDbContext context) : base(context) { }

    public async Task<VerificationCode?> GetActiveCodeAsync(string email, VerificationPurpose purpose) =>
        await _dbSet
            .Where(c => c.Email == email
                     && c.Purpose == purpose
                     && !c.IsUsed
                     && c.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

    public async Task InvalidatePreviousCodesAsync(string email, VerificationPurpose purpose)
    {
        var codes = await _dbSet
            .Where(c => c.Email == email && c.Purpose == purpose && !c.IsUsed)
            .ToListAsync();

        foreach (var code in codes)
            code.IsUsed = true;

        if (codes.Count > 0)
            await _context.SaveChangesAsync();
    }
}
