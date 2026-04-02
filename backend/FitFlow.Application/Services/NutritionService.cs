using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;

namespace FitFlow.Application.Services;

public class NutritionService : INutritionService
{
    private readonly INutritionRepository _nutritionRepository;

    public NutritionService(INutritionRepository nutritionRepository)
    {
        _nutritionRepository = nutritionRepository;
    }

    public Task<IEnumerable<NutritionLogDto>> GetLogsAsync() => throw new NotImplementedException();
    public Task<NutritionLogDto> LogMealAsync(CreateNutritionLogDto dto) => throw new NotImplementedException();
}
