namespace Nautilux_Auctions.Domain.DTO.BidsDto;

public class BidResult
{
    public bool IsSuccessful { get; set; }
    public BidDto CurrentBid { get; set; }
    public string RejectReason { get; set; }
}