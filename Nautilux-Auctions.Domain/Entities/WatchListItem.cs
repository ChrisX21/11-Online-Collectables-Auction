using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class WatchListItem
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int ListingId { get; set; }
    public DateTime AddedDate { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
        
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
}