using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitFlow.API.Controllers;

public class StudioController : BaseController
{
    private readonly IStudioService _studioService;

    public StudioController(IStudioService studioService)
    {
        _studioService = studioService;
    }

    // Public — anyone can view studio info (e.g. landing page, booking page)
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var studio = await _studioService.GetStudioAsync();
        return studio is null ? NotFound(new { message = "Studio not yet configured." }) : Ok(studio);
    }

    // Admin only — initial studio setup
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudioDto dto)
    {
        var result = await _studioService.CreateStudioAsync(dto);
        return Ok(result);
    }

    // Admin only — update studio profile
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateStudioDto dto)
    {
        var result = await _studioService.UpdateStudioAsync(dto);
        return result is null
            ? NotFound(new { message = "Studio not found. Create one first." })
            : Ok(result);
    }
}
