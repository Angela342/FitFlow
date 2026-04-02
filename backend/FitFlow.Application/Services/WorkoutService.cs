using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;

namespace FitFlow.Application.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _workoutRepository;

    public WorkoutService(IWorkoutRepository workoutRepository)
    {
        _workoutRepository = workoutRepository;
    }

    public Task<IEnumerable<WorkoutDto>> GetAllAsync() => throw new NotImplementedException();
    public Task<WorkoutDto?> GetByIdAsync(Guid id) => throw new NotImplementedException();
    public Task<WorkoutDto> CreateAsync(CreateWorkoutDto dto) => throw new NotImplementedException();
    public Task<WorkoutDto?> UpdateAsync(Guid id, UpdateWorkoutDto dto) => throw new NotImplementedException();
    public Task DeleteAsync(Guid id) => throw new NotImplementedException();
}
