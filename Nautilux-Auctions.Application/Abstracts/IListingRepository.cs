using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IListingRepository
{
    Task<Listing?> CreateListingAsync(Listing? listing);
    Task<Listing?> UpdateListingAsync(Listing? listing);
    Task DeleteListingAsync(Listing? listing);
    Task<Listing?> GetListingByIdAsync(int listingId);
    Task<IEnumerable<Listing>> GetAllListingsAsync();
    Task<IEnumerable<Listing>> GetListingByUserIdAsync(Guid userId);
    Task<IEnumerable<Listing>> GetFeaturedListingsAsync();
    Task<IEnumerable<Listing>> GetListingsBySellerIdAsync(Guid sellerId);
    Task<Listing?> GetListingByNameAsync(string name);
    Task<IEnumerable<Listing>> GetActiveListingsAsync();
    Task<IEnumerable<Listing>> GetListingByCategoryAsync(int categoryId);
}