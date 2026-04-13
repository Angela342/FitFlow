using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;

namespace FitFlow.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant());
        if (existing != null)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            Email = dto.Email.ToLowerInvariant(),
            Name = dto.Name,
            Phone = dto.Phone,
            PasswordHash = _passwordHasher.Hash(dto.Password),
        };

        await _userRepository.AddAsync(user);

        var token = _jwtService.GenerateAccessToken(user);

        return new AuthResponseDto(
            Token: token,
            UserId: user.Id.ToString(),
            Name: user.Name,
            Email: user.Email,
            Role: user.Role.ToString()
        );
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLowerInvariant());

        if (user == null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("This account has been disabled.");

        var token = _jwtService.GenerateAccessToken(user);

        return new AuthResponseDto(
            Token: token,
            UserId: user.Id.ToString(),
            Name: user.Name,
            Email: user.Email,
            Role: user.Role.ToString()
        );
    }
}
