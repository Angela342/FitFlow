using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface INutritionRepository : IRepository<NutritionLog>
{
    Task<IEnumerable<NutritionLog>> GetByUserIdAsync(Guid userId);
}
