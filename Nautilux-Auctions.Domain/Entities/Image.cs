using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Image
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public required string Url { get; set; }
    public bool IsPrimary { get; set; }
    public string? Caption { get; set; }
    public int DisplayOrder { get; set; }

    // Navigation properties
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
}