using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class AuctionHistory
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public int? WinningBidId { get; set; }
    public decimal FinalPrice { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = "Ended"; // Ended, Sold, Cancelled, Reserve Not Met

    // Navigation properties
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
        
    [ForeignKey("WinningBidId")]
    public virtual Bid? WinningBid { get; set; }
}