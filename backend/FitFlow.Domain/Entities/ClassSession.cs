using FitFlow.Domain.Enums;

namespace FitFlow.Domain.Entities;

public class ClassSession : BaseEntity
{
    public Guid ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public DateTime StartTime { get; set; }   // UTC
    public SessionStatus Status { get; set; } = SessionStatus.Scheduled;
    public int CurrentEnrollment { get; set; } = 0;
    public string? Notes { get; set; }
}
