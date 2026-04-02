namespace FitFlow.Domain.Entities;

public class WorkoutExercise : BaseEntity
{
    public Guid WorkoutId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Sets { get; set; }
    public int Reps { get; set; }
    public decimal? WeightKg { get; set; }
    public int? DurationSeconds { get; set; }
    public Workout Workout { get; set; } = null!;
}
