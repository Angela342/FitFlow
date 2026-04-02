namespace FitFlow.Domain.Entities;

public class Meal : BaseEntity
{
    public Guid NutritionLogId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Calories { get; set; }
    public decimal ProteinG { get; set; }
    public decimal CarbsG { get; set; }
    public decimal FatG { get; set; }
    public NutritionLog NutritionLog { get; set; } = null!;
}
