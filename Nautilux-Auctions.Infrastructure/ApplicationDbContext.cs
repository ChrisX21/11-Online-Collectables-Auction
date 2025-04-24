using Microsoft.AspNetCore.Identity;
using Nautilux_Auctions.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Listing> Listings { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Authenticity> Authenticities { get; set; }
        public DbSet<AuctionHistory> AuctionHistories { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ShippingDetail> ShippingDetails { get; set; }
        public DbSet<ShippingAddress> ShippingAddresses { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<WatchListItem> WatchListItems { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().Property(u => u.FirstName).HasMaxLength(256);
            builder.Entity<User>().Property(u => u.LastName).HasMaxLength(256);
            builder.Entity<User>().Property(u => u.Email).HasMaxLength(256);
            builder.Entity<User>().Property(u => u.PhoneNumber).HasMaxLength(15);
            
            //User
            builder.Entity<User>()
                .HasMany(u => u.ReviewsReceived)
                .WithOne(r => r.Seller)
                .HasForeignKey(r => r.SellerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<User>()
                .HasMany(u => u.ReviewsGiven)
                .WithOne(r => r.Reviewer)
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<User>()
                .HasMany(u => u.MessagesSent)
                .WithOne(m => m.Sender)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<User>()
                .HasMany(u => u.MessagesReceived)
                .WithOne(m => m.Receiver)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);
            
            builder.Entity<User>()
                .HasMany(u => u.Listings)
                .WithOne(l => l.Seller)
                .HasForeignKey(l => l.SellerId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<User>()
                .HasMany(u => u.Payments)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<User>()
                .HasMany(u => u.ShippingAddresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<User>()
                .HasMany(u => u.WatchList)
                .WithOne(w => w.User)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.NoAction);
            
            //Bid
            builder.Entity<Bid>()
                .HasOne(b => b.Bidder)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Bid>()
                .HasOne(b => b.Listing)
                .WithMany(l => l.Bids)
                .HasForeignKey(b => b.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
                
            //Listing
            builder.Entity<Listing>()
                .HasOne(l => l.AuctionHistory)
                .WithOne(h => h.Listing)
                .HasForeignKey<AuctionHistory>(h => h.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
            
            builder.Entity<Listing>()
                .Property(l => l.Status)
                .HasDefaultValue(ListingStatus.Draft);

            builder.Entity<Listing>()
                .Property(l => l.ShippingOptions)
                .HasDefaultValue(ShippingOption.None);

            builder.Entity<Listing>()
                .HasOne(l => l.Payment)
                .WithOne(p => p.Listing)
                .HasForeignKey<Payment>(p => p.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Listing>()
                .HasOne(l => l.Category)
                .WithMany(c => c.Listings)
                .HasForeignKey(l => l.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Listing>()
                .HasOne(l => l.Authenticity)
                .WithMany(a => a.Listings)
                .HasForeignKey(l => l.AuthenticityId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Listing>()
                .HasMany(l => l.Images)
                .WithOne(i => i.Listing)
                .HasForeignKey(i => i.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.Entity<Listing>()
                .HasMany(l => l.Questions)
                .WithOne(q => q.Listing)
                .HasForeignKey(q => q.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Listing>()
                .HasMany(l => l.Reviews)
                .WithOne(r => r.Listing)
                .HasForeignKey(r => r.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Listing>()
                .HasMany(l => l.WatchedBy)
                .WithOne(w => w.Listing)
                .HasForeignKey(w => w.ListingId)
                .OnDelete(DeleteBehavior.NoAction);
                
            //Payment
            builder.Entity<Payment>()
                .HasOne(p => p.ShippingDetail)
                .WithOne(s => s.Payment)
                .HasForeignKey<ShippingDetail>(s => s.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.Entity<Payment>()
                .Property(p => p.Status)
                .HasDefaultValue(PaymentStatus.Pending);
                
            //ShippingDetail
            builder.Entity<ShippingDetail>()
                .HasOne(s => s.Address)
                .WithMany(a => a.ShippingDetails)
                .HasForeignKey(s => s.AddressId)
                .OnDelete(DeleteBehavior.NoAction);
                
            //Category
            builder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.Subcategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.NoAction);
            
            //Message
            builder.Entity<Message>()
                .HasOne(m => m.Listing)
                .WithMany()
                .HasForeignKey(m => m.ListingId)
                .OnDelete(DeleteBehavior.NoAction);

            //indexes
            builder.Entity<Listing>().HasIndex(l => l.SellerId);
            builder.Entity<Listing>().HasIndex(l => l.CategoryId);
            builder.Entity<Listing>().HasIndex(l => l.EndDate);
            builder.Entity<Listing>().HasIndex(l => l.Status);

            builder.Entity<Bid>().HasIndex(b => b.ListingId);
            builder.Entity<Bid>().HasIndex(b => b.BidderId);
            builder.Entity<Bid>().HasIndex(b => b.Timestamp);

            builder.Entity<Payment>().HasIndex(p => p.UserId);
            builder.Entity<Payment>().HasIndex(p => p.Status);

            builder.Entity<WatchListItem>().HasIndex(w => new { w.UserId, w.ListingId }).IsUnique();

            //decimal precision
            builder.Entity<Listing>().Property(l => l.StartingPrice).HasPrecision(18, 2);
            builder.Entity<Listing>().Property(l => l.ReservePrice).HasPrecision(18, 2);
            builder.Entity<Listing>().Property(l => l.BuyNowPrice).HasPrecision(18, 2);
            
            builder.Entity<Bid>().Property(b => b.Amount).HasPrecision(18, 2);
            builder.Entity<Bid>().Property(b => b.MaxAutoBidAmount).HasPrecision(18, 2);
            
            builder.Entity<AuctionHistory>().Property(h => h.FinalPrice).HasPrecision(18, 2);
            
            builder.Entity<Payment>().Property(p => p.Amount).HasPrecision(18, 2);
            
            builder.Entity<ShippingDetail>().Property(s => s.ShippingCost).HasPrecision(18, 2);
        }
    }
}