using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.BidsDto;
using Nautilux_Auctions.Domain.DTO.ImageDtos;
using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Enums;

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
                CurrentBid = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result != null ? 
                    new BidDto
                    {
                        BidId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Id,
                        Amount = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Amount,
                        UserId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.BidderId,
                        listingId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.ListingId,
                        Timestamp = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Timestamp
                    } : null,
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                SellerId = listing.SellerId,
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
                CurrentBid =  _unitOfWork.Bids.GetCurrentBidForListing(listing).Result != null ? 
                    new BidDto
                    {
                        BidId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Id,
                        Amount = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Amount,
                        UserId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.BidderId,
                        listingId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.ListingId,
                        Timestamp = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Timestamp
                    } : null,
                EndDate = listing.EndDate,
                Status = listing.Status,
                SellerId = listing.SellerId,
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
        public async Task<IEnumerable<ListingsDto>> GetListingsByCategoryAsync(string categoryName)
        {
            if (categoryName == null)
            {
                throw new ArgumentNullException(nameof(categoryName), "Category name cannot be null");
            }
            
            var category = await _unitOfWork.Categories.GetCategoryByNameAsync(categoryName);
            
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with name {categoryName} not found.");
            }
            
            var listings = await _unitOfWork.Listings.GetAllListingsAsync();
            
            if (listings == null || !listings.Any())
            {
                throw new KeyNotFoundException("No listings found.");
            }
            
            var filteredListings = listings.Where(l => l.CategoryId == category.Id).ToList();
            
            if (filteredListings == null || !filteredListings.Any())
            {
                throw new KeyNotFoundException($"No listings found in category {categoryName}.");
            }
            
            return filteredListings.Select(listing => new ListingsDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                CurrentBid =  _unitOfWork.Bids.GetCurrentBidForListing(listing).Result != null ? 
                    new BidDto
                    {
                        BidId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Id,
                        Amount = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Amount,
                        UserId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.BidderId,
                        listingId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.ListingId,
                        Timestamp = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Timestamp
                    } : null,
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                SellerId = listing.SellerId,
                Image = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).FirstOrDefault(),
            });
        }

        public async Task<ListingResponseDto> CreateListingAsync(CreateListingDto listing)
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
                Condition = Enum.Parse<ListingCondition>(listing.StringCondition, ignoreCase: true),
                Origin = listing.Origin,
                Year = listing.Year,
                Dimensions = listing.Dimensions,
                Materials = listing.Materials,
                AuthenticityId = listing.AuthenticityId,
                ShippingOptions = Enum.Parse<ShippingOption>(listing.StringShippingOptions, ignoreCase: true),
            };
            
            var createdListing = await _unitOfWork.Listings.CreateListingAsync(listingEntity);
            await _unitOfWork.SaveChangesAsync();
            
            if (createdListing == null)
            {
                throw new Exception("Failed to create listing.");
            }

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
                Images = listing.Images.Select(image => new ImageResponseDto()
                {
                    Url = image.Url,
                    IsPrimary = image.IsPrimary,
                    Caption = image.Caption,
                    DisplayOrder = image.DisplayOrder,
                }).ToList(),
            };
            return response;
        }

        public async Task<ListingResponseDto> UpdateListingAsync(CreateListingDto listing)
        {
            if (listing == null)
            {
                throw new ArgumentNullException(nameof(listing), "Listing cannot be null");
            }
            var existingListing = await _unitOfWork.Listings.GetListingByIdAsync(listing.ListingId);
            if (existingListing == null)
            {
                throw new KeyNotFoundException($"Listing with ID {listing.ListingId} not found.");
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
            existingListing.Condition = Enum.Parse<ListingCondition>(listing.StringCondition, ignoreCase: true);
            existingListing.Origin = listing.Origin;
            existingListing.Year = listing.Year;
            existingListing.Dimensions = listing.Dimensions;
            existingListing.Materials = listing.Materials;
            existingListing.AuthenticityId = listing.AuthenticityId;
            existingListing.ShippingOptions = Enum.Parse<ShippingOption>(listing.StringShippingOptions, ignoreCase: true);
            existingListing.Status = Enum.Parse<ListingStatus>(listing.StringStatus, ignoreCase: true);
            
            var updatedListing = await _unitOfWork.Listings.UpdateListingAsync(existingListing);
            if (updatedListing == null)
            {
                throw new Exception("Failed to update listing.");
            }
            await _unitOfWork.SaveChangesAsync();
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
                CategoryId = listing.CategoryId,
                IsFeatured = listing.IsFeatured,
                IsActive = listing.IsActive,
                StringCondition = listing.StringCondition,
                StringShippingOptions = listing.StringShippingOptions,
                StringStatus = listing.StringStatus,
                Images = listing.Images.Select(image => new ImageResponseDto()
                {
                    Url = image.Url,
                    IsPrimary = image.IsPrimary,
                    Caption = image.Caption,
                    DisplayOrder = image.DisplayOrder,
                }).ToList(),
                SellerId = listing.SellerId,
            };
            
            return response;
        }

        public async Task<IEnumerable<ListingsDto>> GetFeaturedListingsAsync()
        {
            var listings = await _unitOfWork.Listings.GetFeaturedListingsAsync();
            if (listings == null || !listings.Any())
            {
                throw new KeyNotFoundException("No featured listings found.");
            }

            return listings.Select(listing => new ListingsDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                CurrentBid = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result != null
                    ? new BidDto
                    {
                        BidId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Id,
                        Amount = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Amount,
                        UserId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.BidderId,
                        listingId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.ListingId,
                        Timestamp = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Timestamp
                    }
                    : null,
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                SellerId = listing.SellerId,
                Image = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).FirstOrDefault(),
            });
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
        
        public async Task<IEnumerable<ListingsDto>> GetListingsForUserAsync(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentException("User ID cannot be empty", nameof(userId));
            }

            var userListings = await _unitOfWork.Listings.GetListingsBySellerIdAsync(userId);
            if (userListings == null || !userListings.Any())
            {
                throw new KeyNotFoundException($"No listings found for user with ID {userId}.");
            }

            return userListings.Select(listing => new ListingsDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                StartingPrice = listing.StartingPrice,
                CurrentBid = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result != null ?
                    new BidDto
                    {
                        BidId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Id,
                        Amount = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Amount,
                        UserId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.BidderId,
                        listingId = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.ListingId,
                        Timestamp = _unitOfWork.Bids.GetCurrentBidForListing(listing).Result.Timestamp
                    } : null,
                EndDate = listing.EndDate,
                Status = listing.Status,
                StringStatus = listing.Status.ToString(),
                SellerId = listing.SellerId,
                Image = listing.Images.Select(imageDto => new Image
                {
                    Url = imageDto.Url,
                    IsPrimary = imageDto.IsPrimary,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                }).FirstOrDefault(),
            });
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