using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IClassRepository : IRepository<Class>
{
    Task<IEnumerable<Class>> GetActiveClassesAsync();
}
