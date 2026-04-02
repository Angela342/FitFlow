using FitFlow.Domain.Entities;
using FitFlow.Domain.Interfaces;

namespace FitFlow.Application.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}
