using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class NutritionRepository : BaseRepository<NutritionLog>, INutritionRepository
{
    public NutritionRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<NutritionLog>> GetByUserIdAsync(Guid userId) =>
        await _dbSet
            .Include(n => n.Meals)
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.Date)
            .ToListAsync();
}
