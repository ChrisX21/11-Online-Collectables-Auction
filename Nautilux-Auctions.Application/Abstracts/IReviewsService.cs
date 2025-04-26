using Nautilux_Auctions.Domain.DTO.ReviewDtos;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IReviewsService
{
    Task<ReviewDto> AddReview(ReviewDto review);
    Task<ReviewDto?> GetReviewById(int reviewId);
    Task<List<ReviewDto>> GetReviews();
    Task<List<ReviewDto>> GetReviewsByUserId(Guid userId);
    Task<List<ReviewDto>> GetReviewsByListingId(int listingId);
    Task<List<ReviewDto>> GetReviewsBySellerId(Guid sellerId);
    Task<List<ReviewDto>> GetReviewsByRating(int rating);
    Task<List<ReviewDto>> GetReviewsByRatingForListingId(int listingId, int rating);
    Task RemoveReview(int reviewId);
    
}