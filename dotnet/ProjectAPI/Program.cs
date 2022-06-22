using ApplicationServices.Implementations;
using ApplicationServices.JWT;
using Data.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectAPI;
using Repositories.Implementations;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
    name: "AllowOrigin",
    builder => {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

});

builder.Services.AddDbContext<ProjectContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Connection")));

var settings = builder.Configuration.GetSection(typeof(JwtSettings).Name).Get<JwtSettings>();


builder.Services.AddAuthentication(options => options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(cfg =>
    {
        cfg.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = settings.Issuer,
            ValidAudience = settings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key!))
        };
    });

builder.Services.AddSingleton(settings);

builder.Services.AddScoped<SecurityService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JobAdService>();
builder.Services.AddScoped<ApplicationService>();

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<JobAdRepository>();
builder.Services.AddScoped<ApplicationRepository>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllersWithViews();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
