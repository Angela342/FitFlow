using FitFlow.Application.DTOs;
using FitFlow.Application.Interfaces;
using FitFlow.Domain.Entities;

namespace FitFlow.Application.Services;

public class StudioService : IStudioService
{
    private readonly IStudioRepository _studioRepository;

    public StudioService(IStudioRepository studioRepository)
    {
        _studioRepository = studioRepository;
    }

    public async Task<StudioDto?> GetStudioAsync()
    {
        var studio = await _studioRepository.GetFirstAsync();
        return studio is null ? null : MapToDto(studio);
    }

    public async Task<StudioDto> CreateStudioAsync(CreateStudioDto dto)
    {
        // Only one studio allowed — return existing if already created
        var existing = await _studioRepository.GetFirstAsync();
        if (existing is not null)
            return MapToDto(existing);

        var studio = new Studio
        {
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            Phone = dto.Phone,
            Email = dto.Email,
            Website = dto.Website,
        };

        await _studioRepository.AddAsync(studio);
        return MapToDto(studio);
    }

    public async Task<StudioDto?> UpdateStudioAsync(UpdateStudioDto dto)
    {
        var studio = await _studioRepository.GetFirstAsync();
        if (studio is null) return null;

        studio.Name = dto.Name;
        studio.Description = dto.Description;
        studio.Address = dto.Address;
        studio.Phone = dto.Phone;
        studio.Email = dto.Email;
        studio.Website = dto.Website;

        await _studioRepository.UpdateAsync(studio);
        return MapToDto(studio);
    }

    private static StudioDto MapToDto(Studio s) => new(
        s.Id, s.Name, s.Description, s.Address,
        s.Phone, s.Email, s.Website, s.LogoUrl
    );
}
