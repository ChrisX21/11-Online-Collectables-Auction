using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Requests;

namespace Nautilux_Auctions.Controllers
{
    [ApiController]
    [Route("/api/auth")]
    public class AuthController : Controller
    {
        private readonly IAccountService _accountService;

        public AuthController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            if (registerRequest == null)
            {
                return BadRequest("Invalid request payload.");
            }

            await _accountService.RegisterUserAsync(registerRequest);
            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
            {
                return BadRequest("Invalid request payload.");
            }

            await _accountService.LoginAsync(loginRequest);
            return Ok(new { message = "User logged in successfully." });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(HttpContext httpContext)
        {
            var refreshToken =httpContext.Request.Cookies["REFRESH_TOKEN"];

            await _accountService.RefreshTokenAsync(refreshToken);
            
            return Ok(new { message = "Token refreshed successfully." });
        }


    }
}

