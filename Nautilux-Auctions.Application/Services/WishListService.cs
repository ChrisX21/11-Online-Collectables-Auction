using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.WishListDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class WishListService : IWishListService
{
    private readonly IUnitOfWork _unitOfWork;
    
    public WishListService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    public async Task<IEnumerable<WishListDto>> GetWishListByUserIdAsync(Guid userId)
    {
        var wishListItems = await _unitOfWork.WishLists.GetWishListByUserIdAsync(userId);
        var wishListDtos = wishListItems.Select(wli => new WishListDto
        {
            ListingId = wli.ListingId,
            UserId = wli.UserId,
            AddedDate = wli.AddedDate,
        });
        return wishListDtos;
    }

    public Task<WishListDto> AddToWishListAsync(Guid userId, int listingId)
    {
        var watchListItem = new WatchListItem
        {
            UserId = userId,
            ListingId = listingId,
            AddedDate = DateTime.UtcNow
        };
        _unitOfWork.WishLists.AddToWishListAsync(watchListItem);
        _unitOfWork.SaveChangesAsync();
        
        return Task.FromResult(new WishListDto
        {
            ListingId = watchListItem.ListingId,
            UserId = watchListItem.UserId,
            AddedDate = watchListItem.AddedDate
        });
    }

    public Task RemoveFromWishListAsync(Guid userId, int listingId)
    {
        var watchListItem = new WatchListItem
        {
            UserId = userId,
            ListingId = listingId
        };
        _unitOfWork.WishLists.RemoveFromWishListAsync(watchListItem);
        return _unitOfWork.SaveChangesAsync();
    }
}