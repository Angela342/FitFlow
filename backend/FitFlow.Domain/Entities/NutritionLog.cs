namespace FitFlow.Domain.Entities;

public class NutritionLog : BaseEntity
{
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
    public decimal TotalCalories { get; set; }
    public decimal TotalProteinG { get; set; }
    public decimal TotalCarbsG { get; set; }
    public decimal TotalFatG { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Meal> Meals { get; set; } = new List<Meal>();
}
