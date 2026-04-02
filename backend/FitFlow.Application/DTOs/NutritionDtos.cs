namespace FitFlow.Application.DTOs;

public record NutritionLogDto(
    Guid Id,
    DateOnly Date,
    List<MealDto> Meals,
    decimal TotalCalories,
    decimal TotalProteinG,
    decimal TotalCarbsG,
    decimal TotalFatG);

public record CreateNutritionLogDto(
    DateOnly Date,
    List<CreateMealDto> Meals);

public record MealDto(
    Guid Id,
    string Name,
    decimal Calories,
    decimal ProteinG,
    decimal CarbsG,
    decimal FatG);

public record CreateMealDto(
    string Name,
    decimal Calories,
    decimal ProteinG,
    decimal CarbsG,
    decimal FatG);
