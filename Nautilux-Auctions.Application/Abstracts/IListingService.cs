using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IListingService
{
    Task<ListingResponseDto> CreateListingAsync(CreateListingDto listing);
    Task<IEnumerable<ListingsDto>> GetAllListingsAsync();
    Task<IEnumerable<ListingsDto>> GetActiveListingsAsync();
    Task<IEnumerable<ListingsDto>> GetListingsByCategoryAsync(string categoryName);
    Task<ListingResponseDto> UpdateListingAsync(CreateListingDto listing);
    Task<IEnumerable<ListingsDto>> GetFeaturedListingsAsync();
    Task<IEnumerable<ListingsDto>> GetListingsForUserAsync(Guid userId);
    Task<ListingResponseDto?> GetListingByIdAsync(int listingId);
    Task RemoveListingAsync(int listingId);
    
}