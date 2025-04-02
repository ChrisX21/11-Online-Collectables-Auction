using Microsoft.AspNetCore.Identity;

namespace Nautilux_Auctions.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiresAtUtc { get; set; }
        
        // Navigation properties
        public virtual ICollection<Listing> Listings { get; set; } = new List<Listing>();
        public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public virtual ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();
        public virtual ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
        public virtual ICollection<ShippingAddress> ShippingAddresses { get; set; } = new List<ShippingAddress>();
        public virtual ICollection<WatchListItem> WatchList { get; set; } = new List<WatchListItem>();
        public virtual ICollection<Message> MessagesSent { get; set; } = new List<Message>();
        public virtual ICollection<Message> MessagesReceived { get; set; } = new List<Message>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

        public static User Create(string email, string firstName, string lastName)
        {
            return new User
            {
                Email = email,
                UserName = email,
                FirstName = firstName,
                LastName = lastName
            };
        }

        public override string ToString()
        {
            return $"{FirstName} {LastName}";
        }
    }
}
