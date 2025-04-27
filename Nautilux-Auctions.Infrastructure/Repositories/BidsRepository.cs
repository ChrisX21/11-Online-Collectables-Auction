using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class BidsRepository : IBidsRepository
{
    private readonly ApplicationDbContext _context;
    public BidsRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Bid> SaveBid(Bid bid)
    {
        await _context.Bids.AddAsync(bid);
        return bid;
    }

    public async Task<Bid?> GetHighestBidForListing(int listingId)
    {
        return await _context.Bids
            .Where(b => b.ListingId == listingId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Bid>> GetBidHistory(int listingId)
    {
        return await _context.Bids
            .Where(b => b.ListingId == listingId)
            .OrderByDescending(b => b.Timestamp)
            .ToListAsync();
    }

    public async Task<Bid?> GetCurrentBidForListing(Listing listing)
    {
        return await _context.Bids
            .Where(b => b.ListingId == listing.Id)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefaultAsync();
    }
}