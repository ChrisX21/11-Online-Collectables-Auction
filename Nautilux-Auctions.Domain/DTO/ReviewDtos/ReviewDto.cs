namespace Nautilux_Auctions.Domain.DTO.ReviewDtos;

public class ReviewDto
{
    public int Id { get; set; }
    public Guid ReviewerId { get; set; }
    public int? ListingId { get; set; }
    public Guid? SellerId { get; set; }
    public string Comment { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public DateTime TimeStamp { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    
}