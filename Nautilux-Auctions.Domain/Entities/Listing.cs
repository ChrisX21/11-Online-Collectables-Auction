using System.ComponentModel.DataAnnotations.Schema;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Domain.Entities;

public class Listing
{
    public int Id { get; set; }
    public Guid SellerId { get; set; }
    public int CategoryId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public ListingCondition Condition { get; set; }
    public string? Origin { get; set; }
    public int? Year { get; set; }
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public int? AuthenticityId { get; set; }
    public ShippingOption ShippingOptions { get; set; }
    public ListingStatus Status { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } 
    // Navigation properties
    [ForeignKey("SellerId")]
    public virtual User Seller { get; set; } = null!;
        
    [ForeignKey("CategoryId")]
    public virtual Category Category { get; set; } = null!;
        
    [ForeignKey("AuthenticityId")]
    public virtual Authenticity? Authenticity { get; set; }
        
    public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();
    public virtual ICollection<Image> Images { get; set; } = new List<Image>();
    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    public virtual ICollection<WatchListItem> WatchedBy { get; set; } = new List<WatchListItem>();
    public virtual AuctionHistory? AuctionHistory { get; set; }
    public virtual Payment? Payment { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}