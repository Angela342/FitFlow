using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitFlow.API.Controllers;

[Authorize]
public class WorkoutsController : BaseController
{
    private readonly IWorkoutService _workoutService;

    public WorkoutsController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var workouts = await _workoutService.GetAllAsync();
        return Ok(workouts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var workout = await _workoutService.GetByIdAsync(id);
        return workout is null ? NotFound() : Ok(workout);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkoutDto dto)
    {
        var created = await _workoutService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWorkoutDto dto)
    {
        var updated = await _workoutService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _workoutService.DeleteAsync(id);
        return NoContent();
    }
}
