using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ReviewDtos;

namespace Nautilux_Auctions.Controllers;

[Controller]
[Route("api/reviews")]
public class ReviewsController : Controller
{
    private readonly IReviewsService _reviewsService;
    
    public ReviewsController(IReviewsService reviewsService)
    {
        _reviewsService = reviewsService;
    }

    [HttpPost, Authorize]
    public async Task<IActionResult> AddReview([FromBody] ReviewDto review)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        review.ReviewerId = Guid.Parse(userId);
        var addedReview = await _reviewsService.AddReview(review);
        return CreatedAtAction(nameof(AddReview), new { id = addedReview.Id }, addedReview);
    }
    
    [HttpGet("{reviewId}"), Authorize]
    public async Task<IActionResult> GetReviewById(int reviewId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var review = await _reviewsService.GetReviewById(reviewId);
        if (review == null)
        {
            return NotFound();
        }
        return Ok(review);
    }

    [HttpGet, Authorize]
    public async Task<IActionResult> GetReviews()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviews();
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpGet("user/{userId}"), Authorize]
    public async Task<IActionResult> GetReviewsByUserId(Guid userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviewsByUserId(userId);
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpGet("listing/{listingId}"), Authorize]
    public async Task<IActionResult> GetReviewsByListingId(int listingId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviewsByListingId(listingId);
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpGet("seller/{sellerId}"), Authorize]
    public async Task<IActionResult> GetReviewsBySellerId(Guid sellerId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviewsBySellerId(sellerId);
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpGet("rating/{rating}"), Authorize]
    public async Task<IActionResult> GetReviewsByRating(int rating)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviewsByRating(rating);
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpGet("listing/{listingId}/rating/{rating}"), Authorize]
    public async Task<IActionResult> GetReviewsByRatingForListingId(int listingId, int rating)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var reviews = await _reviewsService.GetReviewsByRatingForListingId(listingId, rating);
        if (reviews == null || !reviews.Any())
        {
            return NotFound("No reviews found.");
        }
        return Ok(reviews);
    }
    
    [HttpDelete("{reviewId}"), Authorize]
    public async Task<IActionResult> RemoveReview(int reviewId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        await _reviewsService.RemoveReview(reviewId);
        return NoContent();
    }
}