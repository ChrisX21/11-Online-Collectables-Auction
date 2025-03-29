using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;
using Microsoft.EntityFrameworkCore;
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

        public async Task<string?> GetUserRole(User user)
        {
            var userRole = await _applicationDbContext.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == user.Id);

            if (userRole == null)
            {
                return null;
            }

            var role =  await _applicationDbContext.Roles
                .FirstOrDefaultAsync(r => r.Id == userRole.RoleId);

            return role.Name;
        }

    }
}
