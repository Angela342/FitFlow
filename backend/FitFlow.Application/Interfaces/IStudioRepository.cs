using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IStudioRepository : IRepository<Studio>
{
    Task<Studio?> GetFirstAsync();
}
