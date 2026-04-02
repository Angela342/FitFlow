using FluentAssertions;
using FitFlow.Application.Interfaces;
using FitFlow.Application.Services;
using Moq;

namespace FitFlow.Tests.Unit;

public class WorkoutServiceTests
{
    private readonly Mock<IWorkoutRepository> _repositoryMock;
    private readonly WorkoutService _sut;

    public WorkoutServiceTests()
    {
        _repositoryMock = new Mock<IWorkoutRepository>();
        _sut = new WorkoutService(_repositoryMock.Object);
    }

    // TODO: Add unit tests for WorkoutService
    [Fact]
    public void Placeholder_Test()
    {
        // This is a placeholder - add your tests here
        true.Should().BeTrue();
    }
}
