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
            ListingId = updatedListing.Id,
            Title = updatedListing.Title,
            Description = updatedListing.Description,
            StartingPrice = updatedListing.StartingPrice,
            EndDate = updatedListing.EndDate,
            StartDate = updatedListing.StartDate,
            ReservePrice = updatedListing.ReservePrice,
            SellerId = updatedListing.SellerId,
            Images = updatedListing.Images.Select(image => new ImageResponseDto()
            {
                Url = image.Url,
                IsPrimary = image.IsPrimary,
                Caption = image.Caption,
                DisplayOrder = image.DisplayOrder,
            }).ToList(),
            Status = updatedListing.Status,
            CategoryId = updatedListing.CategoryId,
            BuyNowPrice = updatedListing.BuyNowPrice,
            IsFeatured = updatedListing.IsFeatured,
            IsActive = updatedListing.IsActive,
            Condition = updatedListing.Condition,
            Origin = updatedListing.Origin,
            Year = updatedListing.Year,
            Dimensions = updatedListing.Dimensions,
            Materials = updatedListing.Materials,
            AuthenticityId = updatedListing.AuthenticityId,
            ShippingOptions = updatedListing.ShippingOptions,
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
        
        var response = new ListingResponseDto
        {
            ListingId = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            StartingPrice = listing.StartingPrice,
            EndDate = listing.EndDate,
            StartDate = listing.StartDate,
            ReservePrice = listing.ReservePrice,
            SellerId = listing.SellerId,
            Images = listing.Images.Select(image => new ImageResponseDto()
            {
                Url = image.Url,
                IsPrimary = image.IsPrimary,
                Caption = image.Caption,
                DisplayOrder = image.DisplayOrder,
            }).ToList(),
        };
        
        return Ok(response);
    }
}