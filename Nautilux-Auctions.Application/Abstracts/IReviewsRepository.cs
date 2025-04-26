using Nautilux_Auctions.Domain.DTO.ReviewDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IReviewsRepository
{
    public Task<Review> AddReview(Review review);
    public Task<Review?> GetReviewById(int reviewId);
    public Task<List<Review>> GetReviews();
    public Task<List<Review>> GetReviewsByUserId(Guid userId);
    public Task<List<Review>> GetReviewsByListingId(int listingId);
    public Task<List<Review>> GetReviewsBySellerId(Guid sellerId);
    public Task<List<Review>> GetReviewsByRating(int rating);
    public Task<List<Review>> GetReviewsByRatingForListingId(int listingId, int rating);
    public Task RemoveReview(Review review);
}