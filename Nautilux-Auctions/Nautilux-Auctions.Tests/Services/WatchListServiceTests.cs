using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Domain.DTO.WishListDtos;
using Nautilux_Auctions.Domain.Entities;
using NUnit.Framework;

namespace Nautilux_Auctions.Tests.Services
{
    [TestFixture]
    public class WishListServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IWishListRepository> _mockWishListRepository;
        private WishListService _wishListService;
        
        [SetUp]
        public void Setup()
        {
            _mockWishListRepository = new Mock<IWishListRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            
            _mockUnitOfWork.Setup(u => u.WishLists).Returns(_mockWishListRepository.Object);
            
            _wishListService = new WishListService(_mockUnitOfWork.Object);
        }
        
        [Test]
        public async Task GetWishListByUserIdAsync_ReturnsWishListItems()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var watchListItems = new List<WatchListItem>
            {
                new WatchListItem { UserId = userId, ListingId = 1, AddedDate = DateTime.UtcNow.AddDays(-1) },
                new WatchListItem { UserId = userId, ListingId = 2, AddedDate = DateTime.UtcNow }
            };
            
            _mockWishListRepository.Setup(repo => repo.GetWishListByUserIdAsync(userId))
                .ReturnsAsync(watchListItems);
            
            // Act
            var result = await _wishListService.GetWishListByUserIdAsync(userId);
            
            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.Should().AllBeOfType<WishListDto>();
            result.Select(item => item.ListingId).Should().BeEquivalentTo(new[] { 1, 2 });
            result.All(item => item.UserId == userId).Should().BeTrue();
        }
        
        [Test]
        public async Task GetWishListByUserIdAsync_WithNoItems_ReturnsEmptyCollection()
        {
            // Arrange
            var userId = Guid.NewGuid();
            
            _mockWishListRepository.Setup(repo => repo.GetWishListByUserIdAsync(userId))
                .ReturnsAsync(new List<WatchListItem>());
            
            // Act
            var result = await _wishListService.GetWishListByUserIdAsync(userId);
            
            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }
        
        [Test]
        public async Task AddToWishListAsync_AddsItemAndReturnsDto()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var listingId = 123;
            DateTime beforeAdd = DateTime.UtcNow;
            
            WatchListItem capturedItem = null;
            _mockWishListRepository.Setup(repo => repo.AddToWishListAsync(It.IsAny<WatchListItem>()))
                .Callback<WatchListItem>(item => capturedItem = item)
                .Returns(Task.CompletedTask);
            
            // Act
            var result = await _wishListService.AddToWishListAsync(userId, listingId);
            
            // Assert
            result.Should().NotBeNull();
            result.ListingId.Should().Be(listingId);
            result.UserId.Should().Be(userId);
            result.AddedDate.Should().BeAfter(beforeAdd);
            
            capturedItem.Should().NotBeNull();
            capturedItem.UserId.Should().Be(userId);
            capturedItem.ListingId.Should().Be(listingId);
            
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
        
        [Test]
        public async Task RemoveFromWishListAsync_RemovesItemFromRepository()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var listingId = 123;
            
            WatchListItem capturedItem = null;
            _mockWishListRepository.Setup(repo => repo.RemoveFromWishListAsync(It.IsAny<WatchListItem>()))
                .Callback<WatchListItem>(item => capturedItem = item)
                .Returns(Task.CompletedTask);
            
            // Act
            await _wishListService.RemoveFromWishListAsync(userId, listingId);
            
            // Assert
            capturedItem.Should().NotBeNull();
            capturedItem.UserId.Should().Be(userId);
            capturedItem.ListingId.Should().Be(listingId);
            
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}