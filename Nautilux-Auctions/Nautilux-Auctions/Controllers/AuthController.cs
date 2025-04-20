using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO;
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
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = HttpContext.Request.Cookies["REFRESH_TOKEN"];

            await _accountService.RefreshTokenAsync(refreshToken);
            
            return Ok(new { message = "Token refreshed successfully." });
        }

        [HttpGet("details")]
        public async Task<IActionResult> Details()
        {
            var refreshToken = HttpContext.Request.Cookies["REFRESH_TOKEN"];
            var user = await _accountService.GetUserDetails(refreshToken);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = HttpContext.Request.Cookies["REFRESH_TOKEN"];
            if (String.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Invalid request payload.");
            }
            await _accountService.Logout(refreshToken);
            
            return Ok(new { message = "User logged out successfully." });
        }
    }
}

