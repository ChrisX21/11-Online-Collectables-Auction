using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nautilux_Auctions.Domain.Exceptions
{
    public class InvalidRefreshTokenException(string message) : Exception(message);

}
