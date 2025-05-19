using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;

namespace Nautilux_Auctions.Controllers;

[Route("api/wishlist"), ApiController]
public class WatchListController : Controller
{
    private readonly IWishListService _wishListService;
    
    public WatchListController(IWishListService wishListService)
    {
        _wishListService = wishListService;
    }
    
    [HttpGet, Authorize]
    public async Task<IActionResult> GetWishList()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var wishList = await _wishListService.GetWishListByUserIdAsync(Guid.Parse(userId));
        if (wishList == null || !wishList.Any())
        {
            return NotFound("No items found in the wishlist.");
        }
        
        return Ok(wishList);
    }
    
    [HttpPost("{listingId}"), Authorize]
    public async Task<IActionResult> AddToWishList(int listingId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var result = await _wishListService.AddToWishListAsync(Guid.Parse(userId), listingId);
        if (result == null)
        {
            return BadRequest("Failed to add item to wishlist.");
        }
        
        return Ok("Item added to wishlist successfully.");
    }
    
    [HttpDelete("{listingId}"), Authorize]
    public async Task<IActionResult> RemoveFromWishList(int listingId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        await _wishListService.RemoveFromWishListAsync(Guid.Parse(userId), listingId);
        return Ok("Item removed from wishlist successfully.");
    }
}