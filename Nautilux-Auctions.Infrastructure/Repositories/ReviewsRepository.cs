using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class ReviewsRepository : IReviewsRepository
{
    private readonly ApplicationDbContext _context;
    
    public ReviewsRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public Task<Review> AddReview(Review review)
    {
        _context.Add(review);
        return Task.FromResult(review);
    }

    public async Task<Review?> GetReviewById(int reviewId)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .FirstOrDefaultAsync(r => r.Id == reviewId);
    }

    public async Task<List<Review>> GetReviews()
    {
        return await _context.Reviews 
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .ToListAsync();
    }

    public async Task<List<Review>> GetReviewsByUserId(Guid userId)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .Where(r => r.ReviewerId == userId)
            .ToListAsync();
    }

    public async Task<List<Review>> GetReviewsByListingId(int listingId)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .Where(r => r.ListingId == listingId)
            .ToListAsync();
    }

    public async Task<List<Review>> GetReviewsBySellerId(Guid sellerId)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .Where(r => r.SellerId == sellerId)
            .ToListAsync();
    }

    public async Task<List<Review>> GetReviewsByRating(int rating)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .Where(r => r.Rating == rating)
            .ToListAsync();
    }
    
    public async Task<List<Review>> GetReviewsByRatingForListingId(int listingId, int rating)
    {
        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Listing)
            .Include(r => r.Seller)
            .Where(r => r.ListingId == listingId && r.Rating == rating)
            .ToListAsync();
    }

    public Task RemoveReview(Review review)
    {
         _context.Reviews.Remove(review);
            return Task.CompletedTask;
    }
}