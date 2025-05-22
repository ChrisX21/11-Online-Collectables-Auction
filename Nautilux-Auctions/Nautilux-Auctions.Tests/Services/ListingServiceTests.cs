using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Domain.DTO.ImageDtos;
using Nautilux_Auctions.Domain.DTO.ListingDtos;
using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Nautilux_Auctions.Tests.Services
{
    [TestFixture]
    public class ListingServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IListingRepository> _mockListingRepository;
        private Mock<ICategoriesRepository> _mockCategoryRepository;
        private Mock<IBidsRepository> _mockBidRepository;
        private ListingService _listingService;

        [SetUp]
        public void Setup()
        {
            _mockListingRepository = new Mock<IListingRepository>();
            _mockCategoryRepository = new Mock<ICategoriesRepository>();
            _mockBidRepository = new Mock<IBidsRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            _mockUnitOfWork.Setup(u => u.Listings).Returns(_mockListingRepository.Object);
            _mockUnitOfWork.Setup(u => u.Categories).Returns(_mockCategoryRepository.Object);
            _mockUnitOfWork.Setup(u => u.Bids).Returns(_mockBidRepository.Object);

            _listingService = new ListingService(_mockUnitOfWork.Object);
        }

        [Test]
        public async Task CreateListingAsync_WithValidData_ReturnsSuccess()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var categoryId = 1;
            var listingId = 1;

            var createDto = new CreateListingDto
            {
                Title = "Test Listing",
                Description = "Test Description",
                StartingPrice = 100.00m,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(7),
                CategoryId = categoryId,
                SellerId = userId,
                StringCondition = "Good",
                StringShippingOptions = "None",
                StringStatus = "Draft",
                Images = new List<ImageDto>
                {
                    new ImageDto { Url = "http://example.com/image.jpg", IsPrimary = true }
                }
            };

            var createdListing = new Listing
            {
                Id = listingId,
                Title = createDto.Title,
                Description = createDto.Description,
                StartingPrice = createDto.StartingPrice,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                CategoryId = createDto.CategoryId,
                SellerId = createDto.SellerId,
                Condition = ListingCondition.Good,
                ShippingOptions = ShippingOption.None,
                Status = ListingStatus.Draft,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Images = new List<Image>
                {
                    new Image
                    {
                        Id = 1,
                        Url = "http://example.com/image.jpg",
                        IsPrimary = true
                    }
                }
            };

            _mockListingRepository.Setup(repo => repo.CreateListingAsync(It.IsAny<Listing>()))
                .ReturnsAsync(createdListing);

            // Act
            var result = await _listingService.CreateListingAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.ListingId.Should().Be(listingId);
            result.Title.Should().Be(createDto.Title);
            result.Description.Should().Be(createDto.Description);
            result.StartingPrice.Should().Be(createDto.StartingPrice);
            
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public async Task GetListingByIdAsync_WithValidId_ReturnsListing()
        {
            // Arrange
            var listingId = 1;
            var sellerId = Guid.NewGuid();

            var listing = new Listing
            {
                Id = listingId,
                Title = "Test Listing",
                Description = "Test Description",
                StartingPrice = 100.00m,
                SellerId = sellerId,
                CategoryId = 1,
                Status = ListingStatus.Active,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow,
                Images = new List<Image>
                {
                    new Image { Id = 1, Url = "http://example.com/image.jpg", IsPrimary = true }
                },
                Bids = new List<Bid>()
            };

            _mockListingRepository.Setup(repo => repo.GetListingByIdAsync(listingId))
                .ReturnsAsync(listing);

            _mockBidRepository.Setup(repo => repo.GetCurrentBidForListing(It.IsAny<Listing>()))
                .ReturnsAsync((Bid)null);

            // Act
            var result = await _listingService.GetListingByIdAsync(listingId);

            // Assert
            result.Should().NotBeNull();
            result.ListingId.Should().Be(listingId);
            result.Title.Should().Be(listing.Title);
            result.SellerId.Should().Be(sellerId);
            result.Images.Should().HaveCount(1);
            result.CurrentBid.Should().BeNull();
        }

        [Test]
        public async Task GetListingByIdAsync_WithInvalidId_ThrowsKeyNotFoundException()
        {
            // Arrange
            var listingId = 999;

            _mockListingRepository.Setup(repo => repo.GetListingByIdAsync(listingId))
                .ReturnsAsync((Listing)null);

            // Act & Assert
            await FluentActions.Invoking(() => _listingService.GetListingByIdAsync(listingId))
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Listing with ID {listingId} not found.");
        }
        

        [Test]
        public async Task GetActiveListingsAsync_ReturnsActiveListings()
        {
            // Arrange
            var activeListings = new List<Listing>
            {
                new Listing
                {
                    Id = 1,
                    Title = "Active Listing 1",
                    Description = "Description 1",
                    StartingPrice = 100.00m,
                    SellerId = Guid.NewGuid(),
                    CategoryId = 1,
                    Status = ListingStatus.Active,
                    Images = new List<Image> { new Image { Url = "http://example.com/1.jpg", IsPrimary = true } }
                },
                new Listing
                {
                    Id = 2,
                    Title = "Active Listing 2",
                    Description = "Description 2",
                    StartingPrice = 200.00m,
                    SellerId = Guid.NewGuid(),
                    CategoryId = 2,
                    Status = ListingStatus.Active,
                    Images = new List<Image> { new Image { Url = "http://example.com/2.jpg", IsPrimary = true } }
                }
            };

            _mockListingRepository.Setup(repo => repo.GetActiveListingsAsync())
                .ReturnsAsync(activeListings);

            _mockBidRepository.Setup(repo => repo.GetCurrentBidForListing(It.IsAny<Listing>()))
                .ReturnsAsync((Bid)null);

            // Act
            var result = await _listingService.GetActiveListingsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.First().Id.Should().Be(1);
            result.First().Title.Should().Be("Active Listing 1");
            result.First().Status.Should().Be(ListingStatus.Active);
        }

        [Test]
        public async Task GetActiveListingsAsync_WithNone_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockListingRepository.Setup(repo => repo.GetActiveListingsAsync())
                .ReturnsAsync(new List<Listing>());

            // Act & Assert
            await FluentActions.Invoking(() => _listingService.GetActiveListingsAsync())
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("No listings found.");
        }

        [Test]
        public async Task GetFeaturedListingsAsync_ReturnsFeaturedListings()
        {
            // Arrange
            var featuredListings = new List<Listing>
            {
                new Listing
                {
                    Id = 1,
                    Title = "Featured Listing 1",
                    Description = "Description 1",
                    StartingPrice = 100.00m,
                    SellerId = Guid.NewGuid(),
                    CategoryId = 1,
                    Status = ListingStatus.Active,
                    IsFeatured = true,
                    Images = new List<Image> { new Image { Url = "http://example.com/1.jpg", IsPrimary = true } }
                },
                new Listing
                {
                    Id = 2,
                    Title = "Featured Listing 2",
                    Description = "Description 2",
                    StartingPrice = 200.00m,
                    SellerId = Guid.NewGuid(),
                    CategoryId = 2,
                    Status = ListingStatus.Active,
                    IsFeatured = true,
                    Images = new List<Image> { new Image { Url = "http://example.com/2.jpg", IsPrimary = true } }
                }
            };

            _mockListingRepository.Setup(repo => repo.GetFeaturedListingsAsync())
                .ReturnsAsync(featuredListings);

            _mockBidRepository.Setup(repo => repo.GetCurrentBidForListing(It.IsAny<Listing>()))
                .ReturnsAsync((Bid)null);

            // Act
            var result = await _listingService.GetFeaturedListingsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.First().Id.Should().Be(1);
            result.First().Title.Should().Be("Featured Listing 1");
        }

        [Test]
        public async Task GetListingsForUserAsync_ReturnsUserListings()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var userListings = new List<Listing>
            {
                new Listing
                {
                    Id = 1,
                    Title = "User Listing 1",
                    Description = "Description 1",
                    StartingPrice = 100.00m,
                    SellerId = userId,
                    CategoryId = 1,
                    Status = ListingStatus.Active,
                    Images = new List<Image> { new Image { Url = "http://example.com/1.jpg", IsPrimary = true } }
                },
                new Listing
                {
                    Id = 2,
                    Title = "User Listing 2",
                    Description = "Description 2",
                    StartingPrice = 200.00m,
                    SellerId = userId,
                    CategoryId = 2,
                    Status = ListingStatus.Draft,
                    Images = new List<Image> { new Image { Url = "http://example.com/2.jpg", IsPrimary = true } }
                }
            };

            _mockListingRepository.Setup(repo => repo.GetListingsBySellerIdAsync(userId))
                .ReturnsAsync(userListings);

            _mockBidRepository.Setup(repo => repo.GetCurrentBidForListing(It.IsAny<Listing>()))
                .ReturnsAsync((Bid)null);

            // Act
            var result = await _listingService.GetListingsForUserAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(l => l.SellerId == userId).Should().BeTrue();
        }
        
        [Test]
        public async Task RemoveListingAsync_WithValidId_CallsDeleteMethod()
        {
            // Arrange
            var listingId = 1;
            var listing = new Listing
            {
                Id = listingId,
                Title = "Test Listing",
                Description = "Test Description",
                StartingPrice = 100.00m,
                SellerId = Guid.NewGuid(),
                CategoryId = 1
            };

            _mockListingRepository.Setup(repo => repo.GetListingByIdAsync(listingId))
                .ReturnsAsync(listing);

            // Act
            await _listingService.RemoveListingAsync(listingId);

            // Assert
            _mockListingRepository.Verify(repo => repo.DeleteListingAsync(listing), Times.Once);
        }

        [Test]
        public async Task RemoveListingAsync_WithInvalidId_ThrowsKeyNotFoundException()
        {
            // Arrange
            var listingId = 999;

            _mockListingRepository.Setup(repo => repo.GetListingByIdAsync(listingId))
                .ReturnsAsync((Listing)null);

            // Act & Assert
            await FluentActions.Invoking(() => _listingService.RemoveListingAsync(listingId))
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Listing with ID {listingId} not found.");
        }
    }
}