using FitFlow.Domain.Enums;

namespace FitFlow.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.Client;
    public bool IsActive { get; set; } = true;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public string? ProfileImageUrl { get; set; }
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<NutritionLog> NutritionLogs { get; set; } = new List<NutritionLog>();
}
