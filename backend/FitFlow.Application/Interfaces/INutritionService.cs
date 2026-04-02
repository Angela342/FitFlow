using FitFlow.Application.DTOs;

namespace FitFlow.Application.Interfaces;

public interface INutritionService
{
    Task<IEnumerable<NutritionLogDto>> GetLogsAsync();
    Task<NutritionLogDto> LogMealAsync(CreateNutritionLogDto dto);
}
