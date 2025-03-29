namespace Nautilux_Auctions.Domain.Exceptions
{
    public class UserRegistrationFailedException(IEnumerable<string> errorDescriptions) 
        : Exception($"Registration failed with following errors: {string.Join(Environment.NewLine, errorDescriptions)}");
    
}
