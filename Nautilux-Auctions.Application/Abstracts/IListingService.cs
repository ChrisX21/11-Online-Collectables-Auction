using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IListingService
{
    Task<Listing> CreateListingAsync(CreateListingDto listing);
    Task<IEnumerable<Listing>> GetAllListingsAsync();
    
}