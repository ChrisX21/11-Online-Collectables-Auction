using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts
{
    public interface IUserRepository
    {
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
    }
}
