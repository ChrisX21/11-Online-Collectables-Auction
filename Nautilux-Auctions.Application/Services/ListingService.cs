using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.ImageDtos;
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
        public async Task<IEnumerable<ListingsDto>> GetAllListingsAsync()
        {
            var allListings = await _unitOfWork.Listings.GetAllListingsAsync();
            if (allListings == null || !allListings.Any())
            {
                throw new KeyNotFoundException("No listings found.");
            }

            return allListings.Select(listing => new ListingsDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                CurrentBid = listing.Bids?.OrderByDescending(b => b.Amount).FirstOrDefault(),
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                Image = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).FirstOrDefault(),
            });
        }

        public async Task<IEnumerable<ListingsDto>> GetActiveListingsAsync()
        {
            var activeListings = await _unitOfWork.Listings.GetActiveListingsAsync();
            if (activeListings == null || !activeListings.Any())
            {
                throw new KeyNotFoundException("No listings found.");
            }

            return activeListings.Select(listing => new ListingsDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                CurrentBid = listing.Bids?.OrderByDescending(b => b.Amount).FirstOrDefault(),
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                Image = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).FirstOrDefault(),
            });
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

        public async Task<Listing> UpdateListingAsync(int id, CreateListingDto listing)
        {
            var existingListing = await _unitOfWork.Listings.GetListingByIdAsync(id);
            if (existingListing == null)
            {
                throw new KeyNotFoundException($"Listing with ID {id} not found.");
            }
            existingListing.Title = listing.Title;
            existingListing.Description = listing.Description;
            existingListing.StartingPrice = listing.StartingPrice;
            existingListing.EndDate = listing.EndDate;
            existingListing.StartDate = listing.StartDate;
            existingListing.ReservePrice = listing.ReservePrice;
            existingListing.SellerId = listing.SellerId;
            existingListing.Images = listing.Images.Select(imageDto => new Image
            {
                Url = imageDto.Url,
                IsPrimary = imageDto.IsPrimary,
                Caption = imageDto.Caption,
                DisplayOrder = imageDto.DisplayOrder,
            }).ToList();
            existingListing.CategoryId = listing.CategoryId;
            existingListing.BuyNowPrice = listing.BuyNowPrice;
            existingListing.IsFeatured = listing.IsFeatured;
            existingListing.IsActive = listing.IsActive;
            existingListing.Condition = listing.Condition;
            existingListing.Origin = listing.Origin;
            existingListing.Year = listing.Year;
            existingListing.Dimensions = listing.Dimensions;
            existingListing.Materials = listing.Materials;
            existingListing.AuthenticityId = listing.AuthenticityId;
            existingListing.ShippingOptions = listing.ShippingOptions;
            existingListing.Status = listing.Status;
            
            var updatedListing = await _unitOfWork.Listings.UpdateListingAsync(existingListing);
            if (updatedListing == null)
            {
                throw new Exception("Failed to update listing.");
            }
            await _unitOfWork.SaveChangesAsync();
            return updatedListing;
        }
        
        public async Task<ListingResponseDto?> GetListingByIdAsync(int id)
        {
            var listing = await _unitOfWork.Listings.GetListingByIdAsync(id);
            if (listing == null)
            {
                throw new KeyNotFoundException($"Listing with ID {id} not found.");
            }
            
            var response = new ListingResponseDto
            {
                ListingId = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                BuyNowPrice = listing.BuyNowPrice,
                IsFeatured = listing.IsFeatured,
                IsActive = listing.IsActive,
                StringCondition = listing.Condition.ToString(),
                Origin = listing.Origin,
                Year = listing.Year,
                Dimensions = listing.Dimensions,
                Materials = listing.Materials,
                AuthenticityId = listing.AuthenticityId,
                ShippingOptions = listing.ShippingOptions,
                StringShippingOptions = listing.ShippingOptions.ToString(),
                Condition = listing.Condition,
                CategoryId = listing.CategoryId,
                EndDate = listing.EndDate,
                StartDate = listing.StartDate,
                ReservePrice = listing.ReservePrice,
                SellerId = listing.SellerId,
                StringStatus = listing.Status.ToString(),
                Images = listing.Images.Select(image => new ImageResponseDto()
                {
                    Id = image.Id,
                    Url = image.Url,
                    IsPrimary = image.IsPrimary,
                    Caption = image.Caption,
                    DisplayOrder = image.DisplayOrder,
                }).ToList(),
            };
            
            return response;
        }

        public async Task RemoveListingAsync(int listingId)
        {
            var listingToRemove = await _unitOfWork.Listings.GetListingByIdAsync(listingId);
            if (listingToRemove == null)
            {
                throw new KeyNotFoundException($"Listing with ID {listingId} not found.");
            }
            await _unitOfWork.Listings.DeleteListingAsync(listingToRemove);
        }
}