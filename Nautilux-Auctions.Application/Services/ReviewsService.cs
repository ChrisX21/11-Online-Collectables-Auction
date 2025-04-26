using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ReviewDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class ReviewsService : IReviewsService
{
    private readonly IUnitOfWork _unitOfWork;
    
    public ReviewsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    public async Task<ReviewDto> AddReview(ReviewDto review)
    {
        if (review is null)
        {
            throw new ArgumentNullException(nameof(review)); 
        }
        
        var reviewEntity = new Review
        {
            ReviewerId = review.ReviewerId,
            ListingId = review.ListingId,
            SellerId = review.SellerId,
            Rating = review.Rating,
            Comment = review.Comment,
            Timestamp= DateTime.UtcNow
        };
        await _unitOfWork.Reviews.AddReview(reviewEntity);
        await _unitOfWork.SaveChangesAsync();
        
        return new ReviewDto
        {
            Id = reviewEntity.Id,
            ReviewerId = reviewEntity.ReviewerId,
            ListingId = reviewEntity.ListingId,
            SellerId = reviewEntity.SellerId,
            Rating = reviewEntity.Rating,
            Comment = reviewEntity.Comment,
            TimeStamp = reviewEntity.Timestamp,
            IsVerifiedPurchase = reviewEntity.IsVerifiedPurchase
        };
    }

    public async Task<ReviewDto?> GetReviewById(int reviewId)
    {
        var review =  await _unitOfWork.Reviews.GetReviewById(reviewId);
        
        return new ReviewDto
        {
            Id = review.Id,
            ReviewerId = review.ReviewerId,
            ListingId = review.ListingId,
            SellerId = review.SellerId,
            Rating = review.Rating,
            Comment = review.Comment,
            TimeStamp = review.Timestamp,
            IsVerifiedPurchase = review.IsVerifiedPurchase
        };
    }

    public async Task<List<ReviewDto>> GetReviews()
    {
        var reviews = await _unitOfWork.Reviews.GetReviews();
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task<List<ReviewDto>> GetReviewsByUserId(Guid userId)
    {   
        var reviews = await _unitOfWork.Reviews.GetReviewsByUserId(userId);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task<List<ReviewDto>> GetReviewsByListingId(int listingId)
    {
        var reviews = await _unitOfWork.Reviews.GetReviewsByListingId(listingId);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task<List<ReviewDto>> GetReviewsBySellerId(Guid sellerId)
    {
        var reviews = await _unitOfWork.Reviews.GetReviewsBySellerId(sellerId);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task<List<ReviewDto>> GetReviewsByRating(int rating)
    {   
        var reviews = await _unitOfWork.Reviews.GetReviewsByRating(rating);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task<List<ReviewDto>> GetReviewsByRatingForListingId(int listingId, int rating)
    {
        var reviews = await _unitOfWork.Reviews.GetReviewsByRatingForListingId(listingId, rating);
        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ListingId = r.ListingId,
            SellerId = r.SellerId,
            Rating = r.Rating,
            Comment = r.Comment,
            TimeStamp = r.Timestamp,
            IsVerifiedPurchase = r.IsVerifiedPurchase
        }).ToList();
        
        return reviewDtos;
    }

    public async Task RemoveReview(int reviewId)
    {
        var review = await _unitOfWork.Reviews.GetReviewById(reviewId);
        if (review == null)
        {
            throw new ArgumentNullException(nameof(review));
        }
        await _unitOfWork.Reviews.RemoveReview(review);
        await _unitOfWork.SaveChangesAsync();
    }
}