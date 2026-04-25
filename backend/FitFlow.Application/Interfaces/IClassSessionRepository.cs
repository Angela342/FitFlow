using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IClassSessionRepository : IRepository<ClassSession>
{
    Task<IEnumerable<ClassSession>> GetSessionsInRangeAsync(DateTime from, DateTime to);
    Task<ClassSession?> GetByIdWithClassAsync(Guid id);
}
