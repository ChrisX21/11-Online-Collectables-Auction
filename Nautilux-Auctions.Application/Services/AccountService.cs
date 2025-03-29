using Microsoft.AspNetCore.Identity;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Exceptions;
using Nautilux_Auctions.Domain.Requests;

namespace Nautilux_Auctions.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAuthTokenProcessor _authProcessor;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;

        public AccountService(IAuthTokenProcessor authTokenProcessor, UserManager<User> userManager, IUserRepository userRepository)
        {
            _authProcessor = authTokenProcessor;
            _userManager = userManager;
            _userRepository = userRepository;
        }

        public async Task RegisterUserAsync(RegisterRequest registerRequest)
        {
            var userExists = await _userManager.FindByEmailAsync(registerRequest.Email) != null;

            if (userExists)
            {
                throw new UserAlreadyExistsException(email: registerRequest.Email);
            }

            var user = User.Create(registerRequest.Email, registerRequest.FirstName, registerRequest.LastName);
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, registerRequest.Password);

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
            {
                throw new UserRegistrationFailedException(result.Errors.Select(x => x.Description));
            }
        }

        public async Task LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                throw new LoginFailedException(loginRequest.Email);
            }

            var (jwtToken, expirationDateInUtc) = _authProcessor.GenerateJwtToken(user);
            var refreshTokenValue = _authProcessor.GenerateRefreshToken();

            var refreshTokenExpirationDateInUtc = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshTokenValue;
            user.RefreshTokenExpiresAtUtc = refreshTokenExpirationDateInUtc;

            await _userManager.UpdateAsync(user);

            _authProcessor.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", jwtToken, expirationDateInUtc);
            _authProcessor.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshTokenValue, refreshTokenExpirationDateInUtc);
        }

        public async Task RefreshTokenAsync(string? refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new InvalidRefreshTokenException("Refresh token is required");
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if(user == null)
            {
                throw new InvalidRefreshTokenException("Unable to retrieve user for refresh token");
            }

            if(user.RefreshTokenExpiresAtUtc < DateTime.UtcNow)
            {
                throw new InvalidRefreshTokenException("Refresh token has expired");
            }

            var (jwtToken, expirationDateInUtc) = _authProcessor.GenerateJwtToken(user);
            var refreshTokenValue = _authProcessor.GenerateRefreshToken();

            var refreshTokenExpirationDateInUtc = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshTokenValue;
            user.RefreshTokenExpiresAtUtc = refreshTokenExpirationDateInUtc;

            await _userManager.UpdateAsync(user);

            _authProcessor.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", jwtToken, expirationDateInUtc);
            _authProcessor.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshTokenValue, refreshTokenExpirationDateInUtc);
        }
        
        public async Task<UserDetailsDto> GetUserDetails(string? refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new UnauthorizedException("Refresh token is required");
            }

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                throw new UnauthorizedException("Unable to retrieve user for refresh token");
            }

            if (user.RefreshTokenExpiresAtUtc < DateTime.UtcNow)
            {
                throw new UnauthorizedException("Refresh token has expired");
            }

            var role = await _userRepository.GetUserRole(user);

            var userDetails = new UserDetailsDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = role
            };

            return userDetails;
        }

        public async Task Logout(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new InvalidRefreshTokenException("Refresh token is required");
            }
            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
            if (user == null)
            {
                throw new InvalidRefreshTokenException("Unable to retrieve user for refresh token");
            }

            _authProcessor.RemoveAuthTokensFromHttpCookie();

            user.RefreshToken = null;
            user.RefreshTokenExpiresAtUtc = null;

            await _userManager.UpdateAsync(user);
            
        }
    }
}
