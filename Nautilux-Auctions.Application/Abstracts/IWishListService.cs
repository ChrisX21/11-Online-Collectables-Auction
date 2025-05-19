using Nautilux_Auctions.Domain.DTO.WishListDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IWishListService
{
    Task<IEnumerable<WishListDto>> GetWishListByUserIdAsync(Guid userId);
    Task<WishListDto> AddToWishListAsync(Guid userId, int listingId);
    Task RemoveFromWishListAsync(Guid userId, int listingId);
}