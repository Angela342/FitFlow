using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
}
