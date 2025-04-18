using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
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
    
    [HttpGet("all")]
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
            SellerId = createdListing.SellerId,
            Images = createdListing.Images.Select(image => new ImageResponseDto()
            {
                Url = image.Url,
                IsPrimary = image.IsPrimary,
                Caption = image.Caption,
                DisplayOrder = image.DisplayOrder,
            }).ToList(),
        };
        return CreatedAtAction(nameof(GetListings), new { id = createdListing.Id }, response);
    }

}