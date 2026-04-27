using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;
using FitFlow.Domain.Enums;

namespace FitFlow.Application.Services;

public class ClassService : IClassService
{
    private readonly IClassRepository _classRepo;
    private readonly IClassSessionRepository _sessionRepo;

    public ClassService(IClassRepository classRepo, IClassSessionRepository sessionRepo)
    {
        _classRepo = classRepo;
        _sessionRepo = sessionRepo;
    }

    public async Task<IEnumerable<ClassDto>> GetAllClassesAsync()
    {
        var classes = await _classRepo.GetAllAsync();
        return classes.Select(MapClassToDto);
    }

    public async Task<ClassDto?> GetClassByIdAsync(Guid id)
    {
        var c = await _classRepo.GetByIdAsync(id);
        return c is null ? null : MapClassToDto(c);
    }

    public async Task<ClassDto> CreateClassAsync(CreateClassDto dto)
    {
        var c = new Class
        {
            Name = dto.Name,
            Description = dto.Description,
            Instructor = dto.Instructor,
            MaxCapacity = dto.MaxCapacity,
            DurationMinutes = dto.DurationMinutes,
            Price = dto.Price,
            ColorLabel = dto.ColorLabel,
            Category = dto.Category,
            IsActive = true,
        };
        await _classRepo.AddAsync(c);
        return MapClassToDto(c);
    }

    public async Task<ClassDto> UpdateClassAsync(Guid id, UpdateClassDto dto)
    {
        var c = await _classRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Class {id} not found.");
        c.Name = dto.Name;
        c.Description = dto.Description;
        c.Instructor = dto.Instructor;
        c.MaxCapacity = dto.MaxCapacity;
        c.DurationMinutes = dto.DurationMinutes;
        c.Price = dto.Price;
        c.ColorLabel = dto.ColorLabel;
        c.Category = dto.Category;
        c.IsActive = dto.IsActive;
        await _classRepo.UpdateAsync(c);
        return MapClassToDto(c);
    }

    public async Task DeleteClassAsync(Guid id)
    {
        _ = await _classRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Class {id} not found.");
        await _classRepo.DeleteAsync(id);
    }

    public async Task<IEnumerable<ClassSessionDto>> GetSessionsAsync(DateTime from, DateTime to)
    {
        var sessions = await _sessionRepo.GetSessionsInRangeAsync(from, to);
        return sessions.Select(MapSessionToDto);
    }

    public async Task<ClassSessionDto?> GetSessionByIdAsync(Guid id)
    {
        var s = await _sessionRepo.GetByIdWithClassAsync(id);
        return s is null ? null : MapSessionToDto(s);
    }

    public async Task<ClassSessionDto> CreateSessionAsync(CreateSessionDto dto)
    {
        var cls = await _classRepo.GetByIdAsync(dto.ClassId)
            ?? throw new KeyNotFoundException($"Class {dto.ClassId} not found.");
        var session = new ClassSession
        {
            ClassId = dto.ClassId,
            Class = cls,
            StartTime = dto.StartTime.ToUniversalTime(),
            Status = SessionStatus.Scheduled,
            CurrentEnrollment = 0,
            Notes = dto.Notes,
        };
        await _sessionRepo.AddAsync(session);
        return MapSessionToDto(session);
    }

    public async Task<ClassSessionDto> UpdateSessionAsync(Guid id, UpdateSessionDto dto)
    {
        var s = await _sessionRepo.GetByIdWithClassAsync(id)
            ?? throw new KeyNotFoundException($"Session {id} not found.");
        s.StartTime = dto.StartTime.ToUniversalTime();
        s.Notes = dto.Notes;
        await _sessionRepo.UpdateAsync(s);
        return MapSessionToDto(s);
    }

    public async Task<ClassSessionDto> CancelSessionAsync(Guid id)
    {
        var s = await _sessionRepo.GetByIdWithClassAsync(id)
            ?? throw new KeyNotFoundException($"Session {id} not found.");
        s.Status = SessionStatus.Cancelled;
        await _sessionRepo.UpdateAsync(s);
        return MapSessionToDto(s);
    }

    public async Task DeleteSessionAsync(Guid id)
    {
        _ = await _sessionRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Session {id} not found.");
        await _sessionRepo.DeleteAsync(id);
    }

    private static ClassDto MapClassToDto(Class c) => new(
        c.Id, c.Name, c.Description, c.Instructor,
        c.MaxCapacity, c.DurationMinutes, c.Price,
        c.ColorLabel, c.Category, c.IsActive, c.CreatedAt
    );

    private static ClassSessionDto MapSessionToDto(ClassSession s) => new(
        s.Id, s.ClassId,
        s.Class?.Name ?? string.Empty,
        s.Class?.Instructor ?? string.Empty,
        s.Class?.ColorLabel ?? "#f9a8d4",
        s.Class?.DurationMinutes ?? 0,
        s.Class?.MaxCapacity ?? 0,
        s.Class?.Price ?? 0,
        s.Class?.Category,
        s.StartTime,
        s.Status.ToString(),
        s.CurrentEnrollment,
        (s.Class?.MaxCapacity ?? 0) - s.CurrentEnrollment,
        s.Notes
    );
}
