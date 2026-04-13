namespace FitFlow.Application.DTOs;

public record StudioDto(
    Guid Id,
    string Name,
    string? Description,
    string? Address,
    string? Phone,
    string? Email,
    string? Website,
    string? LogoUrl
);

public record CreateStudioDto(
    string Name,
    string? Description,
    string? Address,
    string? Phone,
    string? Email,
    string? Website
);

public record UpdateStudioDto(
    string Name,
    string? Description,
    string? Address,
    string? Phone,
    string? Email,
    string? Website
);
