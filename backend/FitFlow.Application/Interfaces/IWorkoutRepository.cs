using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IWorkoutRepository : IRepository<Workout>
{
    Task<IEnumerable<Workout>> GetByUserIdAsync(Guid userId);
}
