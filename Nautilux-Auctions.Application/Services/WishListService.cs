using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.WishListDtos;

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
        throw new NotImplementedException();
    }

    public Task AddToWishListAsync(Guid userId, int listingId)
    {
        throw new NotImplementedException();
    }

    public Task RemoveFromWishListAsync(Guid userId, int listingId)
    {
        throw new NotImplementedException();
    }
}