namespace Nautilux_Auctions.Domain.DTO.BidsDto;

public class BidDto
{
    public int listingId { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
}