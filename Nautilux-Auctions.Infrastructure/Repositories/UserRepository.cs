using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nautilux_Auctions.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public UserRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _applicationDbContext.Users
               .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
    }
}
