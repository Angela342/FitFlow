using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;

namespace FitFlow.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // TODO: Hash password, create user, generate JWT
        throw new NotImplementedException();
    }

    public Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // TODO: Validate credentials, generate JWT
        throw new NotImplementedException();
    }
}
