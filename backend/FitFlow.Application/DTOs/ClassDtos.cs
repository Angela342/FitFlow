namespace FitFlow.Application.DTOs;

// ── Class template DTOs ────────────────────────────────────────────────────────

public record CreateClassDto(
    string Name,
    string? Description,
    string Instructor,
    int MaxCapacity,
    int DurationMinutes,
    decimal Price,
    string ColorLabel,
    string? Category
);

public record UpdateClassDto(
    string Name,
    string? Description,
    string Instructor,
    int MaxCapacity,
    int DurationMinutes,
    decimal Price,
    string ColorLabel,
    string? Category,
    bool IsActive
);

public record ClassDto(
    Guid Id,
    string Name,
    string? Description,
    string Instructor,
    int MaxCapacity,
    int DurationMinutes,
    decimal Price,
    string ColorLabel,
    string? Category,
    bool IsActive,
    DateTime CreatedAt
);

// ── Class session DTOs ─────────────────────────────────────────────────────────

public record CreateSessionDto(
    Guid ClassId,
    DateTime StartTime,
    string? Notes
);

public record UpdateSessionDto(
    DateTime StartTime,
    string? Notes
);

public record ClassSessionDto(
    Guid Id,
    Guid ClassId,
    string ClassName,
    string Instructor,
    string ColorLabel,
    int DurationMinutes,
    int MaxCapacity,
    decimal Price,
    string? Category,
    DateTime StartTime,
    string Status,
    int CurrentEnrollment,
    int SpotsAvailable,
    string? Notes
);
