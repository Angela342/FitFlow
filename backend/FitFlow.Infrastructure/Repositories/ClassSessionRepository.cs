using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class ClassSessionRepository : BaseRepository<ClassSession>, IClassSessionRepository
{
    public ClassSessionRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<ClassSession>> GetSessionsInRangeAsync(DateTime from, DateTime to) =>
        await _dbSet
            .Include(s => s.Class)
            .Where(s => s.StartTime >= from && s.StartTime < to)
            .OrderBy(s => s.StartTime)
            .ToListAsync();

    public async Task<ClassSession?> GetByIdWithClassAsync(Guid id) =>
        await _dbSet.Include(s => s.Class).FirstOrDefaultAsync(s => s.Id == id);
}
