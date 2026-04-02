using FitFlow.Application.DTOs;

namespace FitFlow.Application.Interfaces;

public interface IWorkoutService
{
    Task<IEnumerable<WorkoutDto>> GetAllAsync();
    Task<WorkoutDto?> GetByIdAsync(Guid id);
    Task<WorkoutDto> CreateAsync(CreateWorkoutDto dto);
    Task<WorkoutDto?> UpdateAsync(Guid id, UpdateWorkoutDto dto);
    Task DeleteAsync(Guid id);
}
