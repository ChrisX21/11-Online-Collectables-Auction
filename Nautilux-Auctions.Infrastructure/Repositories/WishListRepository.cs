using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class WishListRepository : IWishListRepository
{
    private readonly ApplicationDbContext _context;
    
    public WishListRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task AddToWishListAsync(WatchListItem watchListItem)
    {
        await _context.WatchListItems.AddAsync(watchListItem);
    }

    public async Task RemoveFromWishListAsync(WatchListItem watchListItem)
    {
        var existingItem = await _context.WatchListItems
            .FirstOrDefaultAsync(wli => wli.UserId == watchListItem.UserId && wli.ListingId == watchListItem.ListingId);
            
        if (existingItem != null)
        {
            _context.WatchListItems.Remove(existingItem);
        }
    }

    public async Task<IEnumerable<WatchListItem>> GetWishListByUserIdAsync(Guid userId)
    {
        return await _context.WatchListItems.Where(wli => wli.UserId == userId)
            .Include(wli => wli.Listing)
            .ToListAsync();
    }
}

