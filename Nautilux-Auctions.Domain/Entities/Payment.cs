using System.ComponentModel.DataAnnotations.Schema;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int ListingId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
    public string PaymentMethod { get; set; } = "Credit Card"; // Credit Card, PayPal, Bank Transfer
    public PaymentStatus Status { get; set; }
    public string? TransactionId { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
        
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
        
    public virtual ShippingDetail? ShippingDetail { get; set; }
}
