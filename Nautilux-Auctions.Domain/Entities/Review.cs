using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Review
{
    public int Id { get; set; }
    public Guid ReviewerId { get; set; }
    public int? ListingId { get; set; }
    public Guid? SellerId { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string? Comment { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsVerifiedPurchase { get; set; }

    // Navigation properties
    [ForeignKey("ReviewerId")]
    public virtual User Reviewer { get; set; } = null!;
        
    [ForeignKey("ListingId")]
    public virtual Listing? Listing { get; set; }
        
    [ForeignKey("SellerId")]
    public virtual User? Seller { get; set; }
}