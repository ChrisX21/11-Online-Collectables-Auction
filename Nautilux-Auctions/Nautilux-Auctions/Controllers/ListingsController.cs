using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ImageDtos;
using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Controllers;

[ApiController]
[Route("/api/listings")]
public class ListingsController : Controller
{
    private readonly IListingService _listingService;
    public ListingsController(IListingService listingService)
    {
        _listingService = listingService;
    }
    [HttpGet]
    public async Task<IActionResult> GetListings()
    {
        var listings = await _listingService.GetAllListingsAsync();
        if(listings == null || !listings.Any())
        {
            return NotFound("No listings found.");
        }
        return Ok(listings);
    }

    [HttpGet("user"), Authorize]
    public async Task<IActionResult> GetUserListings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        var listings = await _listingService.GetListingsForUserAsync(Guid.Parse(userId));
        if (listings == null || !listings.Any())
        {
            return NotFound("No listings found.");
        }
        return Ok(listings);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveListings()
    {
        var listings = await _listingService.GetActiveListingsAsync();
        if (listings == null || !listings.Any())
        {
            return NotFound("No listings found.");
        }

        return Ok(listings);
    }
    
    [HttpPost, Authorize]
    public async Task<IActionResult> CreateListing([FromBody] CreateListingDto listing)
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
        listing.SellerId = Guid.Parse(userId);
                
        var createdListing = await _listingService.CreateListingAsync(listing);
        
        return CreatedAtAction(nameof(GetListings), new { id = createdListing.ListingId }, createdListing);
    }
    
    [HttpPut("{id}"), Authorize]
    public async Task<IActionResult> UpdateListing(int id, [FromBody] CreateListingDto listing)
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
        
        var updatedListing = await _listingService.UpdateListingAsync(listing);
        if (updatedListing == null)
        {
            return NotFound($"Listing with id {id} not found.");
        }
        
        return Ok(updatedListing);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetListingById(int id)
    {
        var listing = await _listingService.GetListingByIdAsync(id);
        if (listing == null)
        {
            return NotFound($"Listing with id {id} not found.");
        }
        return Ok(listing);
    }
    
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedListings()
    {
        var listings = await _listingService.GetFeaturedListingsAsync();
        if (listings == null || !listings.Any())
        {
            return NotFound("No featured listings found.");
        }
        return Ok(listings);
    }
    
    [HttpGet("category/{categoryName}")]
    public async Task<IActionResult> GetListingsByCategory(string categoryName)
    {
        var listings = await _listingService.GetListingsByCategoryAsync(categoryName);
        if (listings == null || !listings.Any())
        {
            return NotFound($"No listings found in category {categoryName}.");
        }
        return Ok(listings);
    }
    
    [HttpDelete("{id}"), Authorize]
    public async Task<IActionResult> DeleteListing(int id)
    {
        try
        {
            await _listingService.RemoveListingAsync(id);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        return NoContent();
    }
}