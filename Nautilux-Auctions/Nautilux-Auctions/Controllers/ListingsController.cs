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
    [Authorize]
    public async Task<IActionResult> GetListings()
    {
        var listings = await _listingService.GetAllListingsAsync();
        if(listings == null || !listings.Any())
        {
            return NotFound("No listings found.");
        }
        return Ok(listings);
    }

    [HttpGet("active")]
    [Authorize]
    public async Task<IActionResult> GetActiveListings()
    {
        var listings = await _listingService.GetActiveListingsAsync();
        if (listings == null || !listings.Any())
        {
            return NotFound("No listings found.");
        }

        return Ok(listings);
    }
    
    [HttpPost]
    [Authorize]
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
        var response = new ListingResponseDto
        {
            ListingId = createdListing.Id,
            Title = createdListing.Title,
            Description = createdListing.Description,
            StartingPrice = createdListing.StartingPrice,
            EndDate = createdListing.EndDate,
            StartDate = createdListing.StartDate,
            ReservePrice = createdListing.ReservePrice,
            BuyNowPrice = createdListing.BuyNowPrice,
            Origin = createdListing.Origin,
            Year = createdListing.Year,
            Dimensions = createdListing.Dimensions,
            Materials = createdListing.Materials,
            AuthenticityId = createdListing.AuthenticityId,
            ShippingOptions = createdListing.ShippingOptions,
            CategoryId = createdListing.CategoryId,
            Condition = createdListing.Condition,
            IsFeatured = createdListing.IsFeatured,
            IsActive = createdListing.IsActive,
            Status = createdListing.Status,
            StringStatus = createdListing.Status.ToString(),
            Images = createdListing.Images.Select(image => new ImageResponseDto()
            {
                Url = image.Url,
                IsPrimary = image.IsPrimary,
                Caption = image.Caption,
                DisplayOrder = image.DisplayOrder,
            }).ToList(),
            SellerId = createdListing.SellerId,
        };
        return CreatedAtAction(nameof(GetListings), new { id = createdListing.Id }, response);
    }
    
    [HttpPut("{id}")]
    [Authorize]
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
        
        var updatedListing = await _listingService.UpdateListingAsync(id, listing);
        if (updatedListing == null)
        {
            return NotFound($"Listing with id {id} not found.");
        }
        
        var response = new ListingResponseDto
        {
            ListingId = listing.ListingId,
            Title = listing.Title,
            Description = listing.Description,
            StartingPrice = listing.StartingPrice,
            EndDate = listing.EndDate,
            StartDate = listing.StartDate,
            ReservePrice = listing.ReservePrice,
            BuyNowPrice = listing.BuyNowPrice,
            Origin = listing.Origin,
            Year = listing.Year,
            Dimensions = listing.Dimensions,
            Materials = listing.Materials,
            AuthenticityId = listing.AuthenticityId,
            ShippingOptions = listing.ShippingOptions,
            CategoryId = listing.CategoryId,
            Condition = listing.Condition,
            IsFeatured = listing.IsFeatured,
            IsActive = listing.IsActive,
            Status = listing.Status,
            StringStatus = listing.Status.ToString(),
            Images = listing.Images.Select(image => new ImageResponseDto()
            {
                Url = image.Url,
                IsPrimary = image.IsPrimary,
                Caption = image.Caption,
                DisplayOrder = image.DisplayOrder,
            }).ToList(),
            SellerId = listing.SellerId,
        };
        
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetListingById(int id)
    {
        var listing = await _listingService.GetListingByIdAsync(id);
        if (listing == null)
        {
            return NotFound($"Listing with id {id} not found.");
        }
        return Ok(listing);
    }
    
    [HttpDelete("{id}")]
    [Authorize]
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