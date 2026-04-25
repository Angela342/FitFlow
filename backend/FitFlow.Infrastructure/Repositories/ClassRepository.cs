using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class ClassRepository : BaseRepository<Class>, IClassRepository
{
    public ClassRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Class>> GetActiveClassesAsync() =>
        await _dbSet.Where(c => c.IsActive).OrderBy(c => c.Name).ToListAsync();
}
