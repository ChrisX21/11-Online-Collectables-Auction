using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class ShippingDetail
{
    public int Id { get; set; }
    public int PaymentId { get; set; }
    public int AddressId { get; set; }
    public string? TrackingNumber { get; set; }
    public string? Carrier { get; set; }
    public decimal ShippingCost { get; set; }
    public DateTime? EstimatedDelivery { get; set; }
    public DateTime? ActualDelivery { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Shipped, Delivered, Returned

    // Navigation properties
    [ForeignKey("PaymentId")]
    public virtual Payment Payment { get; set; } = null!;
        
    [ForeignKey("AddressId")]
    public virtual ShippingAddress Address { get; set; } = null!;
}