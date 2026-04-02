using FitFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitFlow.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    public DbSet<NutritionLog> NutritionLogs => Set<NutritionLog>();
    public DbSet<Meal> Meals => Set<Meal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        // Workout
        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Workouts)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WorkoutExercise
        modelBuilder.Entity<WorkoutExercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.WeightKg).HasPrecision(6, 2);
            entity.HasOne(e => e.Workout)
                  .WithMany(w => w.Exercises)
                  .HasForeignKey(e => e.WorkoutId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // NutritionLog
        modelBuilder.Entity<NutritionLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalCalories).HasPrecision(8, 2);
            entity.Property(e => e.TotalProteinG).HasPrecision(8, 2);
            entity.Property(e => e.TotalCarbsG).HasPrecision(8, 2);
            entity.Property(e => e.TotalFatG).HasPrecision(8, 2);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.NutritionLogs)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Meal
        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Calories).HasPrecision(8, 2);
            entity.Property(e => e.ProteinG).HasPrecision(8, 2);
            entity.Property(e => e.CarbsG).HasPrecision(8, 2);
            entity.Property(e => e.FatG).HasPrecision(8, 2);
            entity.HasOne(e => e.NutritionLog)
                  .WithMany(n => n.Meals)
                  .HasForeignKey(e => e.NutritionLogId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is Domain.Entities.BaseEntity &&
                        (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            ((Domain.Entities.BaseEntity)entry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entry.State == EntityState.Added)
                ((Domain.Entities.BaseEntity)entry.Entity).CreatedAt = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
