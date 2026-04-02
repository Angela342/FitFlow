using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitFlow.API.Controllers;

[Authorize]
public class NutritionController : BaseController
{
    private readonly INutritionService _nutritionService;

    public NutritionController(INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _nutritionService.GetLogsAsync();
        return Ok(logs);
    }

    [HttpPost("log")]
    public async Task<IActionResult> LogMeal([FromBody] CreateNutritionLogDto dto)
    {
        var log = await _nutritionService.LogMealAsync(dto);
        return Ok(log);
    }
}
