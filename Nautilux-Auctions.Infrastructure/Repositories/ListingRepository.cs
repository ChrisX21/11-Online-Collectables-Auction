using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
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
    public async Task<Listing?> CreateListingAsync(Listing? listing)
    {
        await _context.Listings.AddAsync(listing);
        return listing;
    }

    public Task<Listing?> UpdateListingAsync(Listing? listing)
    {
        _context.Listings.Update(listing);
        return Task.FromResult(listing);
    }

    public Task DeleteListingAsync(Listing? listing)
    {
        _context.Listings.Remove(listing);
        return Task.CompletedTask;
    }

    public async Task<Listing?> GetListingByIdAsync(int listingId)
    {
        return await _context.Listings.
            Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .FirstOrDefaultAsync(l => l.Id == listingId);
    }

    public async Task<IEnumerable<Listing>> GetAllListingsAsync()
    {
        return await _context.Listings
            .Select(l => l)
            .Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetListingByUserIdAsync(Guid userId)
    {
        return await _context.Listings
            .Select(l => l)
            .Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .Where(l => l.SellerId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetFeaturedListingsAsync()
    {
        return await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.IsFeatured == true).ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetListingsBySellerIdAsync(Guid sellerId)
    {
        return await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.SellerId == sellerId)
            .ToListAsync();
    }

    public async Task<Listing?> GetListingByNameAsync(string name)
    {
        return await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .FirstOrDefaultAsync(l => l.Title == name);
    }

    public async Task<IEnumerable<Listing>> GetActiveListingsAsync()
    {
        return await _context.Listings 
            .Where(l => l.Status == ListingStatus.Active)
            .Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .ToListAsync();
        
    }
    public async Task<IEnumerable<Listing>> GetListingByCategoryAsync(int categoryId)
    {
        return await _context.Listings
            .Where(l => l.CategoryId == categoryId)
            .Include(l => l.Images)
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .ToListAsync();
    }
}