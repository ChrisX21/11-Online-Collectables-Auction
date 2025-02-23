namespace Nautilux_Auctions.Domain.Exceptions
{
    public class LoginFailedException(string email) : Exception($"Invalid email: {email} or password");

}
