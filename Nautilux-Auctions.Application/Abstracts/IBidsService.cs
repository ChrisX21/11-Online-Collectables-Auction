using Nautilux_Auctions.Domain.DTO.BidsDto;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IBidsService
{
    Task<BidResult> PlaceBid(int listingId, decimal bidAmount, Guid userId);
    Task<BidResult> GetCurrentBid(int auctionId);
}