using FitFlow.Domain.Entities;

namespace FitFlow.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
