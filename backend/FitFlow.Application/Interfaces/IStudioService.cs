using FitFlow.Application.DTOs;

namespace FitFlow.Application.Interfaces;

public interface IStudioService
{
    Task<StudioDto?> GetStudioAsync();
    Task<StudioDto> CreateStudioAsync(CreateStudioDto dto);
    Task<StudioDto?> UpdateStudioAsync(UpdateStudioDto dto);
}
