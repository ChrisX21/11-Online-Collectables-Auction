using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Domain.DTO.ReviewDtos;
using Nautilux_Auctions.Domain.Entities;
using NUnit.Framework;

namespace Nautilux_Auctions.Tests.Services
{
    [TestFixture]
    public class ReviewsServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IReviewsRepository> _mockReviewsRepository;
        private ReviewsService _reviewsService;

        [SetUp]
        public void Setup()
        {
            _mockReviewsRepository = new Mock<IReviewsRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(u => u.Reviews).Returns(_mockReviewsRepository.Object);
            _reviewsService = new ReviewsService(_mockUnitOfWork.Object);
        }
        

        [Test]
        public void AddReview_WithNullReview_ThrowsArgumentNullException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.AddReview(null))
                .Should().ThrowAsync<ArgumentNullException>()
                .WithMessage("*review*");
        }

        [Test]
        public async Task GetReviewById_WithValidId_ReturnsReviewDto()
        {
            // Arrange
            var reviewId = 1;
            var userId = Guid.NewGuid();
            var sellerId = Guid.NewGuid();
            var review = new Review
            {
                Id = reviewId,
                ReviewerId = userId,
                ListingId = 1,
                SellerId = sellerId,
                Rating = 5,
                Comment = "Excellent item!",
                Timestamp = DateTime.UtcNow.AddDays(-1),
                IsVerifiedPurchase = true
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewById(reviewId))
                .ReturnsAsync(review);

            // Act
            var result = await _reviewsService.GetReviewById(reviewId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(reviewId);
            result.ReviewerId.Should().Be(userId);
            result.ListingId.Should().Be(1);
            result.SellerId.Should().Be(sellerId);
            result.Rating.Should().Be(5);
            result.Comment.Should().Be("Excellent item!");
            result.TimeStamp.Should().Be(review.Timestamp);
            result.IsVerifiedPurchase.Should().BeTrue();
        }

        [Test]
        public void GetReviewById_WithInvalidId_ThrowsArgumentException()
        {
            // Arrange
            var invalidId = 0;

            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewById(invalidId))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid review ID");
        }

        [Test]
        public async Task GetReviews_ReturnsAllReviews()
        {
            // Arrange
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 1,
                    SellerId = Guid.NewGuid(),
                    Rating = 4,
                    Comment = "Good",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 2,
                    SellerId = Guid.NewGuid(),
                    Rating = 5,
                    Comment = "Excellent",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviews())
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviews();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result[0].Id.Should().Be(1);
            result[0].Rating.Should().Be(4);
            result[0].Comment.Should().Be("Good");
            result[1].Id.Should().Be(2);
            result[1].Rating.Should().Be(5);
            result[1].Comment.Should().Be("Excellent");
        }

        [Test]
        public async Task GetReviewsByUserId_ReturnsUserReviews()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = userId,
                    ListingId = 1,
                    SellerId = Guid.NewGuid(),
                    Rating = 4,
                    Comment = "Good",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = userId,
                    ListingId = 2,
                    SellerId = Guid.NewGuid(),
                    Rating = 5,
                    Comment = "Excellent",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewsByUserId(userId))
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviewsByUserId(userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(r => r.ReviewerId == userId).Should().BeTrue();
        }

        [Test]
        public void GetReviewsByUserId_WithEmptyGuid_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsByUserId(Guid.Empty))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid user ID");
        }

        [Test]
        public async Task GetReviewsByListingId_ReturnsListingReviews()
        {
            // Arrange
            var listingId = 1;
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = listingId,
                    SellerId = Guid.NewGuid(),
                    Rating = 4,
                    Comment = "Good",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = listingId,
                    SellerId = Guid.NewGuid(),
                    Rating = 5,
                    Comment = "Excellent",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewsByListingId(listingId))
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviewsByListingId(listingId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(r => r.ListingId == listingId).Should().BeTrue();
        }

        [Test]
        public void GetReviewsByListingId_WithInvalidId_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsByListingId(0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid listing ID");
        }

        [Test]
        public async Task GetReviewsBySellerId_ReturnsSellerReviews()
        {
            // Arrange
            var sellerId = Guid.NewGuid();
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 1,
                    SellerId = sellerId,
                    Rating = 4,
                    Comment = "Good seller",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 2,
                    SellerId = sellerId,
                    Rating = 5,
                    Comment = "Excellent service",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewsBySellerId(sellerId))
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviewsBySellerId(sellerId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(r => r.SellerId == sellerId).Should().BeTrue();
        }

        [Test]
        public void GetReviewsBySellerId_WithEmptyGuid_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsBySellerId(Guid.Empty))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid seller ID");
        }

        [Test]
        public async Task GetReviewsByRating_ReturnsRatingFilteredReviews()
        {
            // Arrange
            var rating = 5;
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 1,
                    SellerId = Guid.NewGuid(),
                    Rating = rating,
                    Comment = "Perfect!",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = 2,
                    SellerId = Guid.NewGuid(),
                    Rating = rating,
                    Comment = "Excellent!",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewsByRating(rating))
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviewsByRating(rating);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(r => r.Rating == rating).Should().BeTrue();
        }

        [Test]
        public void GetReviewsByRating_WithInvalidRating_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsByRating(0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid rating value");

            FluentActions.Invoking(() => _reviewsService.GetReviewsByRating(6))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid rating value");
        }

        [Test]
        public async Task GetReviewsByRatingForListingId_ReturnsFilteredReviews()
        {
            // Arrange
            var listingId = 1;
            var rating = 4;
            var reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = listingId,
                    SellerId = Guid.NewGuid(),
                    Rating = rating,
                    Comment = "Good product",
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    IsVerifiedPurchase = true
                },
                new Review
                {
                    Id = 2,
                    ReviewerId = Guid.NewGuid(),
                    ListingId = listingId,
                    SellerId = Guid.NewGuid(),
                    Rating = rating,
                    Comment = "Nice item",
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    IsVerifiedPurchase = false
                }
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewsByRatingForListingId(listingId, rating))
                .ReturnsAsync(reviews);

            // Act
            var result = await _reviewsService.GetReviewsByRatingForListingId(listingId, rating);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(r => r.ListingId == listingId && r.Rating == rating).Should().BeTrue();
        }

        [Test]
        public void GetReviewsByRatingForListingId_WithInvalidListingId_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsByRatingForListingId(0, 4))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid listing ID");
        }

        [Test]
        public void GetReviewsByRatingForListingId_WithInvalidRating_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.GetReviewsByRatingForListingId(1, 0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid rating value");

            FluentActions.Invoking(() => _reviewsService.GetReviewsByRatingForListingId(1, 6))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid rating value");
        }

        [Test]
        public async Task RemoveReview_WithValidId_CallsRepositoryAndSavesChanges()
        {
            // Arrange
            var reviewId = 1;
            var review = new Review
            {
                Id = reviewId,
                ReviewerId = Guid.NewGuid(),
                Rating = 3,
                Comment = "Average",
                Timestamp = DateTime.UtcNow.AddDays(-1)
            };

            _mockReviewsRepository.Setup(repo => repo.GetReviewById(reviewId))
                .ReturnsAsync(review);

            // Act
            await _reviewsService.RemoveReview(reviewId);

            // Assert
            _mockReviewsRepository.Verify(repo => repo.RemoveReview(review), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public void RemoveReview_WithInvalidId_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.RemoveReview(0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid review ID");
        }

        [Test]
        public void RemoveReview_WithNonExistentReview_ThrowsArgumentNullException()
        {
            // Arrange
            var reviewId = 999;

            _mockReviewsRepository.Setup(repo => repo.GetReviewById(reviewId))
                .ReturnsAsync((Review)null);

            // Act & Assert
            FluentActions.Invoking(() => _reviewsService.RemoveReview(reviewId))
                .Should().ThrowAsync<ArgumentNullException>()
                .WithMessage("*review*");
        }
    }
}