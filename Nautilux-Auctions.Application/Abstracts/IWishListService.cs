using Nautilux_Auctions.Domain.DTO.WishListDtos;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IWishListService
{
    Task<IEnumerable<WishListDto>> GetWishListByUserIdAsync(Guid userId);
    Task AddToWishListAsync(Guid userId, int listingId);
    Task RemoveFromWishListAsync(Guid userId, int listingId);
}