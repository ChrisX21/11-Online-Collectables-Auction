using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IWishListRepository
{
    Task AddToWishListAsync(WatchListItem watchListItem);
    Task RemoveFromWishListAsync(WatchListItem watchListItem);
    Task<IEnumerable<WatchListItem>> GetWishListByUserIdAsync(Guid userId);
}