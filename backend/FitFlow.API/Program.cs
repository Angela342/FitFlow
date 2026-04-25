using FitFlow.API.Extensions;
using FitFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

AppContext.SetSwitch("System.Net.DisableIPv6", true);

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddAuthenticationServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// CORS must be first so preflight responses include the right headers
app.UseCors("AllowFrontend");

// Swagger + auto-migrations in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Only redirect to HTTPS when a real HTTPS port is available (not in local dev)
if (!app.Environment.IsDevelopment())
{
    // Only add redirect if running behind a proper TLS terminator
    // Skip it locally — no HTTPS cert is configured
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
