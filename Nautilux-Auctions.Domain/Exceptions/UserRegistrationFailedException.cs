using System.ComponentModel;
using System.Threading.Tasks.Dataflow;

namespace Nautilux_Auctions.Domain.Exceptions
{
    public class UserRegistrationFailedException(IEnumerable<string> errorDescritpions) 
        : Exception($"Registration failed with following errors: {string.Join(Environment.NewLine, errorDescritpions)}");
    
}
