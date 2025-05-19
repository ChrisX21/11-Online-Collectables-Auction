using Nautilux_Auctions.Domain.DTO;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Requests;

namespace Nautilux_Auctions.Application.Abstracts
{
    public interface IAccountService
    {
        Task RegisterUserAsync(RegisterRequest loginRequest);
        Task LoginAsync(LoginRequest loginRequest);
        Task RefreshTokenAsync(string refreshToken);
        Task<UserDetailsDto> GetUserDetails(string refreshToken);
        Task UpdateUser(Guid userId, UpdateUserRequest updateUserRequest);
        Task Logout(string refreshToken);
    }
}
