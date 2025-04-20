using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IListingRepository
{
    Task<Listing> CreateListingAsync(Listing listing);
    Task<Listing> UpdateListingAsync(Listing listing);
    Task DeleteListingAsync(int listingId);
    Task<Listing?> GetListingByIdAsync(int listingId);
    Task<IEnumerable<Listing>> GetAllListingsAsync();
    Task<IEnumerable<Listing>> GetListingByUserIdAsync(string userId);
    Task<IEnumerable<Listing>> GetActiveListingsAsync();
    Task<IEnumerable<Listing>> GetClosedListingsAsync();
    
}