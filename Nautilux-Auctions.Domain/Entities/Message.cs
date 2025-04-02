using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public required string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
    public int? ListingId { get; set; }

    // Navigation properties
    [ForeignKey("SenderId")]
    public virtual User Sender { get; set; } = null!;
        
    [ForeignKey("ReceiverId")]
    public virtual User Receiver { get; set; } = null!;
        
    [ForeignKey("ListingId")]
    public virtual Listing? Listing { get; set; }
}
