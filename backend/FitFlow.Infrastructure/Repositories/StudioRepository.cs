using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class StudioRepository : BaseRepository<Studio>, IStudioRepository
{
    public StudioRepository(AppDbContext context) : base(context) { }

    public async Task<Studio?> GetFirstAsync() =>
        await _dbSet.OrderBy(s => s.CreatedAt).FirstOrDefaultAsync();
}
