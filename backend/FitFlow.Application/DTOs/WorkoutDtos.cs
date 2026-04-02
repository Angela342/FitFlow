namespace FitFlow.Application.DTOs;

public record WorkoutDto(
    Guid Id,
    string Name,
    string? Description,
    List<ExerciseDto> Exercises,
    DateTime? ScheduledAt,
    DateTime? CompletedAt,
    DateTime CreatedAt);

public record CreateWorkoutDto(
    string Name,
    string? Description,
    List<CreateExerciseDto> Exercises,
    DateTime? ScheduledAt);

public record UpdateWorkoutDto(
    string Name,
    string? Description,
    DateTime? ScheduledAt,
    DateTime? CompletedAt);

public record ExerciseDto(
    Guid Id,
    string Name,
    int Sets,
    int Reps,
    decimal? WeightKg,
    int? DurationSeconds);

public record CreateExerciseDto(
    string Name,
    int Sets,
    int Reps,
    decimal? WeightKg,
    int? DurationSeconds);
