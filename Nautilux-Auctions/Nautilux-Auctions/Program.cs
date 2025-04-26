
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Infrastructure;
using Nautilux_Auctions.Infrastructure.Options;
using Nautilux_Auctions.Infrastructure.Processors;
using Nautilux_Auctions.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Nautilux_Auctions.Handlers;
using Nautilux_Auctions.Application.Services;
using Microsoft.OpenApi.Models;
using Nautilux_Auctions.Hubs;
using Nautilux_Auctions.Infrastructure.DataSeeding;

namespace Nautilux_Auctions
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.JwtOptionsKey));

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            var corsPolicy = "_allowFrontend";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: corsPolicy, policy =>
                {
                    policy
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });


            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAccountService, AccountService>();
            builder.Services.AddScoped<IAuthTokenProcessor, AuthTokenProcessor>();
            builder.Services.AddScoped<IListingRepository, ListingRepository>();
            builder.Services.AddScoped<IListingService, ListingService>();
            builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
            builder.Services.AddScoped<ICategoriesService, CategoriesService>();
            builder.Services.AddScoped<IBidsRepository, BidsRepository>();
            builder.Services.AddScoped<IBidsService, BidsService>();
            builder.Services.AddScoped<IReviewsRepository, ReviewsRepository>();
            builder.Services.AddScoped<IReviewsService, ReviewsService>();
            builder.Services.AddScoped<IQuestionsRepository, QuestionsRepository>();
            builder.Services.AddScoped<IQuestionsService, QuestionsService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            builder.Services.AddHttpContextAccessor();
            builder.Services.AddSignalR();
            builder.Services.AddExceptionHandler <GlobalExceptionHandler>();
        

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                var jwtOptions = builder.Configuration.GetSection(JwtOptions.JwtOptionsKey)
                .Get<JwtOptions>() ?? throw new ArgumentException(nameof(JwtOptions));

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["ACCESS_TOKEN"];
                        return Task.CompletedTask;
                    }
                };
            });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    var userManager = services.GetRequiredService<UserManager<User>>();
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
                    var logger = services.GetRequiredService<ILogger<Program>>();

                    logger.LogInformation("Starting database seeding...");
                    DbInitializer.SeedDatabaseAsync(context, userManager, roleManager).Wait();
                    logger.LogInformation("Database seeding completed successfully.");
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }

            app.UseExceptionHandler(_ => { });

            app.UseHttpsRedirection();
            app.UseCors(corsPolicy);
            app.UseAuthentication();
            app.UseAuthorization();
            
            app.MapControllers();
            app.MapHub<BidsHub>("/hubs/bids");


            app.Run();
        }
    }
}
