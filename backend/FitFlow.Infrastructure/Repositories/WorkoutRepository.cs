using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class WorkoutRepository : BaseRepository<Workout>, IWorkoutRepository
{
    public WorkoutRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Workout>> GetByUserIdAsync(Guid userId) =>
        await _dbSet
            .Include(w => w.Exercises)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
}
