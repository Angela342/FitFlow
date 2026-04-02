namespace FitFlow.Domain.Entities;

public class Workout : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public User User { get; set; } = null!;
    public ICollection<WorkoutExercise> Exercises { get; set; } = new List<WorkoutExercise>();
}
