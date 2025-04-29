using System.Data.Entity;
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

    public Task RemoveFromWishListAsync(WatchListItem watchListItem)
    {
        _context.Remove(watchListItem);
        return Task.CompletedTask;
    }

    public async Task<IEnumerable<int>> GetWishListByUserIdAsync(Guid userId)
    {
        return await _context.WatchListItems    
            .Where(w => w.UserId == userId)
            .Select(w => w.ListingId)
            .ToListAsync();
    }
}