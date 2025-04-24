using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IListingService
{
    Task<Listing> CreateListingAsync(CreateListingDto listing);
    Task<IEnumerable<ListingsDto>> GetAllListingsAsync();
    Task<IEnumerable<ListingsDto>> GetActiveListingsAsync();
    Task<Listing> UpdateListingAsync(int id, CreateListingDto listing);
    Task<ListingResponseDto?> GetListingByIdAsync(int listingId);
    Task RemoveListingAsync(int listingId);
    
}