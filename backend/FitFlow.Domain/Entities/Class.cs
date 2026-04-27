namespace FitFlow.Domain.Entities;

public class Class : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Instructor { get; set; } = string.Empty;
    public int MaxCapacity { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public string ColorLabel { get; set; } = "#f9a8d4";
    public string? Category { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<ClassSession> Sessions { get; set; } = new List<ClassSession>();
}
