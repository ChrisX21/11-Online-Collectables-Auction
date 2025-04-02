using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Notification
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public required string Type { get; set; } // BidOutbid, AuctionEnding, AuctionWon, NewMessage, etc.
    public required string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
    public int? ReferenceId { get; set; } // ID of the related entity (Listing, Bid, Message, etc.)

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}