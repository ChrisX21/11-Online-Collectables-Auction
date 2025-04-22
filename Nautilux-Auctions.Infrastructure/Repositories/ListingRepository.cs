using System.Data.Entity;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class ListingRepository : IListingRepository
{
    private readonly ApplicationDbContext _context;
    public ListingRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<Listing> CreateListingAsync(Listing listing)
    {
        await _context.Listings.AddAsync(listing);
        return listing;
    }

    public Task<Listing> UpdateListingAsync(Listing listing)
    {
        _context.Listings.Update(listing);
        return Task.FromResult(listing);
    }

    public async Task DeleteListingAsync(int listingId)
    {
        throw new NotImplementedException();
    }

    public async Task<Listing?> GetListingByIdAsync(int listingId)
    {
        return await _context.Listings.FindAsync(listingId);
    }

    public Task<IEnumerable<Listing>> GetAllListingsAsync()
    {
        return Task.FromResult(_context.Listings.AsEnumerable());
    }

    public Task<IEnumerable<Listing>> GetListingByUserIdAsync(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Listing>> GetActiveListingsAsync()
    {
        return await _context.Listings 
            .Where(l => l.Status == ListingStatus.Active)
            .ToListAsync();
        
    }

    public Task<IEnumerable<Listing>> GetClosedListingsAsync()
    {
        throw new NotImplementedException();
    }
}