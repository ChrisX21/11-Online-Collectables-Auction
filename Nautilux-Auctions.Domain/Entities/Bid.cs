using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Bid
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public Guid BidderId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsAutoBid { get; set; }
    public decimal? MaxAutoBidAmount { get; set; }

    // Navigation properties
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
        
    [ForeignKey("BidderId")]
    public virtual User Bidder { get; set; } = null!;
}