using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Domain.DTO.CategoriesDtos;
using Nautilux_Auctions.Domain.Entities;
using NUnit.Framework;

namespace Nautilux_Auctions.Tests.Services
{
    [TestFixture]
    public class CategoriesServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<ICategoriesRepository> _mockCategoriesRepository;
        private CategoriesService _categoriesService;

        [SetUp]
        public void Setup()
        {
            _mockCategoriesRepository = new Mock<ICategoriesRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(u => u.Categories).Returns(_mockCategoriesRepository.Object);
            _categoriesService = new CategoriesService(_mockUnitOfWork.Object);
        }

        [Test]
        public async Task GetAllAsync_WithExistingCategories_ReturnsRootCategoriesWithSubcategories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Electronics", Description = "Electronic items" },
                new Category { Id = 2, Name = "Computers", ParentCategoryId = 1, Description = "Computer items" },
                new Category { Id = 3, Name = "Phones", ParentCategoryId = 1, Description = "Phone items" },
                new Category { Id = 4, Name = "Clothing", Description = "Clothing items" },
                new Category { Id = 5, Name = "T-Shirts", ParentCategoryId = 4, Description = "T-Shirt items" }
            };

            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(categories);

            // Act
            var result = await _categoriesService.GetAllAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2); // Only root categories (Electronics, Clothing)
            
            // Verify Electronics category
            var electronics = result.FirstOrDefault(c => c.Id == 1);
            electronics.Should().NotBeNull();
            electronics.Name.Should().Be("Electronics");
            electronics.SubCategories.Should().HaveCount(2);
            electronics.SubCategories.Should().Contain(c => c.Name == "Computers");
            electronics.SubCategories.Should().Contain(c => c.Name == "Phones");
            
            // Verify Clothing category
            var clothing = result.FirstOrDefault(c => c.Id == 4);
            clothing.Should().NotBeNull();
            clothing.Name.Should().Be("Clothing");
            clothing.SubCategories.Should().HaveCount(1);
            clothing.SubCategories.Should().Contain(c => c.Name == "T-Shirts");
        }

        [Test]
        public void GetAllAsync_WithNoCategories_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(new List<Category>());

            // Act & Assert
            FluentActions.Invoking(() => _categoriesService.GetAllAsync())
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("No categories found.");
        }

        [Test]
        public async Task GetByIdAsync_WithExistingCategory_ReturnsCategoryWithSubcategories()
        {
            // Arrange
            int categoryId = 1;
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Electronics", Description = "Electronic items" },
                new Category { Id = 2, Name = "Computers", ParentCategoryId = 1, Description = "Computer items" },
                new Category { Id = 3, Name = "Phones", ParentCategoryId = 1, Description = "Phone items" }
            };

            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(categories);

            // Act
            var result = await _categoriesService.GetByIdAsync(categoryId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Name.Should().Be("Electronics");
            result.Description.Should().Be("Electronic items");
            result.SubCategories.Should().HaveCount(2);
            result.SubCategories.Should().Contain(c => c.Name == "Computers");
            result.SubCategories.Should().Contain(c => c.Name == "Phones");
        }

        [Test]
        public void GetByIdAsync_WithNonExistentCategory_ThrowsKeyNotFoundException()
        {
            // Arrange
            int nonExistentCategoryId = 999;
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Electronics", Description = "Electronic items" }
            };

            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(categories);

            // Act & Assert
            FluentActions.Invoking(() => _categoriesService.GetByIdAsync(nonExistentCategoryId))
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Category with id {nonExistentCategoryId} not found.");
        }

        [Test]
        public void GetByIdAsync_WithNoCategories_ThrowsKeyNotFoundException()
        {
            // Arrange
            int categoryId = 1;
            
            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(new List<Category>());

            // Act & Assert
            FluentActions.Invoking(() => _categoriesService.GetByIdAsync(categoryId))
                .Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage("No categories found.");
        }

        [Test]
        public async Task CreateAsync_WithValidData_CreatesAndReturnsCategory()
        {
            // Arrange
            var categoryDto = new CategoriesDto
            {
                Name = "New Category",
                Description = "New Category Description"
            };

            var createdCategory = new Category
            {
                Id = 1,
                Name = categoryDto.Name,
                Description = categoryDto.Description
            };

            _mockCategoriesRepository.Setup(repo => repo.CreateAsync(It.IsAny<Category>()))
                .ReturnsAsync(createdCategory);

            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(new List<Category> { createdCategory });

            // Act
            var result = await _categoriesService.CreateAsync(categoryDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Name.Should().Be(categoryDto.Name);
            result.Description.Should().Be(categoryDto.Description);
            
            _mockCategoriesRepository.Verify(repo => repo.CreateAsync(
                It.Is<Category>(c => 
                    c.Name == categoryDto.Name && 
                    c.Description == categoryDto.Description)), 
                Times.Once);
            
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public async Task CreateAsync_WithParentCategory_CreatesSubcategory()
        {
            // Arrange
            var parentCategoryId = 1;
            var categoryDto = new CategoriesDto
            {
                Name = "New Subcategory",
                Description = "New Subcategory Description",
                ParentCategoryId = parentCategoryId
            };

            var createdCategory = new Category
            {
                Id = 2,
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                ParentCategoryId = parentCategoryId
            };

            var parentCategory = new Category
            {
                Id = parentCategoryId,
                Name = "Parent Category",
                Description = "Parent Description"
            };

            _mockCategoriesRepository.Setup(repo => repo.CreateAsync(It.IsAny<Category>()))
                .ReturnsAsync(createdCategory);

            _mockCategoriesRepository.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(new List<Category> { parentCategory, createdCategory });

            // Act
            var result = await _categoriesService.CreateAsync(categoryDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(2);
            result.Name.Should().Be(categoryDto.Name);
            result.Description.Should().Be(categoryDto.Description);
            result.ParentCategoryId.Should().Be(parentCategoryId);
            
            _mockCategoriesRepository.Verify(repo => repo.CreateAsync(
                It.Is<Category>(c => 
                    c.Name == categoryDto.Name && 
                    c.Description == categoryDto.Description &&
                    c.ParentCategoryId == parentCategoryId)), 
                Times.Once);
        }

        [Test]
        public void CreateAsync_WithNullCategory_ThrowsArgumentNullException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _categoriesService.CreateAsync(null))
                .Should().ThrowAsync<ArgumentNullException>()
                .WithMessage("*Category cannot be null.*");
        }
    }
}