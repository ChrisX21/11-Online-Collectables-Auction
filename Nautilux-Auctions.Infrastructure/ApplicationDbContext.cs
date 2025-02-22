using Microsoft.AspNetCore.Identity;
using Nautilux_Auctions.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Nautilux_Auctions.Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().Property(u => u.FirstName).HasMaxLength(256);
            builder.Entity<User>().Property(u => u.LastName).HasMaxLength(256);

        }
    }
}
