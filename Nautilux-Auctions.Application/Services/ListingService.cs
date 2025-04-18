using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class ListingService : IListingService
{
        private readonly IUnitOfWork _unitOfWork;

        public ListingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Listing>> GetAllListingsAsync()
        {
            var allListings = await _unitOfWork.Listings.GetAllListingsAsync();
            if (allListings == null || !allListings.Any())
            {
                throw new KeyNotFoundException("No listings found.");
            }
            return allListings;
        }
        public async Task<Listing> CreateListingAsync(CreateListingDto listing)
        {
            if (listing == null)
            {
                throw new ArgumentNullException(nameof(listing), "Listing cannot be null");
            }

            var listingEntity = new Listing()
            {
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                EndDate = listing.EndDate,
                StartDate = listing.StartDate,
                ReservePrice = listing.ReservePrice,
                SellerId = listing.SellerId,
                Images = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).ToList(),
                CategoryId = listing.CategoryId,
                BuyNowPrice = listing.BuyNowPrice,
                IsFeatured = listing.IsFeatured,
                IsActive = true,
                Condition = listing.Condition,
                Origin = listing.Origin,
                Year = listing.Year,
                Dimensions = listing.Dimensions,
                Materials = listing.Materials,
                AuthenticityId = listing.AuthenticityId,
                ShippingOptions = listing.ShippingOptions,
            };
            
            var createdListing = await _unitOfWork.Listings.CreateListingAsync(listingEntity);
            await _unitOfWork.SaveChangesAsync();
            
            return createdListing;
        }

        
}