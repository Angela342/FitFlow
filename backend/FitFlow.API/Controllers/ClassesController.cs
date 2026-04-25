using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitFlow.API.Controllers;

[ApiController]
[Route("api/classes")]
public class ClassesController : BaseController
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    // ── Class templates ────────────────────────────────────────────────────────

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _classService.GetAllClassesAsync();
        return Ok(classes);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var c = await _classService.GetClassByIdAsync(id);
        if (c is null) return NotFound(new { message = "Class not found." });
        return Ok(c);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateClassDto dto)
    {
        var c = await _classService.CreateClassAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClassDto dto)
    {
        try
        {
            var c = await _classService.UpdateClassAsync(id, dto);
            return Ok(c);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _classService.DeleteClassAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Sessions ───────────────────────────────────────────────────────────────

    [HttpGet("sessions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSessions([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        // Default: current week (Mon–Sun)
        var utcNow = DateTime.UtcNow;
        var start = from?.ToUniversalTime() ?? utcNow.Date.AddDays(-(int)utcNow.DayOfWeek + (int)DayOfWeek.Monday);
        var end   = to?.ToUniversalTime()   ?? start.AddDays(7);
        var sessions = await _classService.GetSessionsAsync(start, end);
        return Ok(sessions);
    }

    [HttpGet("sessions/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSessionById(Guid id)
    {
        var s = await _classService.GetSessionByIdAsync(id);
        if (s is null) return NotFound(new { message = "Session not found." });
        return Ok(s);
    }

    [HttpPost("sessions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionDto dto)
    {
        try
        {
            var s = await _classService.CreateSessionAsync(dto);
            return CreatedAtAction(nameof(GetSessionById), new { id = s.Id }, s);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("sessions/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSession(Guid id, [FromBody] UpdateSessionDto dto)
    {
        try
        {
            var s = await _classService.UpdateSessionAsync(id, dto);
            return Ok(s);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("sessions/{id:guid}/cancel")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CancelSession(Guid id)
    {
        try
        {
            var s = await _classService.CancelSessionAsync(id);
            return Ok(s);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("sessions/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSession(Guid id)
    {
        try
        {
            await _classService.DeleteSessionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
