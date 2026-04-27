using FitFlow.Application.DTOs;

namespace FitFlow.Application.Interfaces;

public interface IClassService
{
    Task<IEnumerable<ClassDto>> GetAllClassesAsync();
    Task<ClassDto?> GetClassByIdAsync(Guid id);
    Task<ClassDto> CreateClassAsync(CreateClassDto dto);
    Task<ClassDto> UpdateClassAsync(Guid id, UpdateClassDto dto);
    Task DeleteClassAsync(Guid id);

    Task<IEnumerable<ClassSessionDto>> GetSessionsAsync(DateTime from, DateTime to);
    Task<ClassSessionDto?> GetSessionByIdAsync(Guid id);
    Task<ClassSessionDto> CreateSessionAsync(CreateSessionDto dto);
    Task<ClassSessionDto> UpdateSessionAsync(Guid id, UpdateSessionDto dto);
    Task<ClassSessionDto> CancelSessionAsync(Guid id);
    Task DeleteSessionAsync(Guid id);
}
