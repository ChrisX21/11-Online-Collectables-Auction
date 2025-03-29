using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts
{
    public interface IAuthTokenProcessor
    {
        (string jwtToken, DateTime expiresAtUtc) GenerateJwtToken(User user);
        string GenerateRefreshToken();
        void WriteAuthTokenAsHttpOnlyCookie(string cookieName, string token, DateTime expiration);
        void RemoveAuthTokensFromHttpCookie();
    }
}
