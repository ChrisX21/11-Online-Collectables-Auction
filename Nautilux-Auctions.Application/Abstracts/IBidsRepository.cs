using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IBidsRepository
{
    Task<Bid> SaveBid(Bid bid);
    Task<Bid?> GetHighestBidForListing(int listingId);
    Task<IEnumerable<Bid>> GetBidHistory(int listingId);
    Task<Bid?> GetCurrentBidForListing(Listing listing);
    Task<IEnumerable<Bid>> GetAllBidsForUser(Guid userId);
}