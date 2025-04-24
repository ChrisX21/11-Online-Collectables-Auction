using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.CategoriesDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class CategoriesService : ICategoriesService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoriesService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoriesDto>> GetAllAsync()
    {
        var allCategories = await _unitOfWork.Categories.GetAllAsync();
        if(allCategories is null || !allCategories.Any())
        {
            throw new KeyNotFoundException("No categories found.");
        }

        var rootCategories = allCategories
            .Where(c => c.ParentCategoryId == null)
            .ToList();

        return rootCategories.Select(c => MapCategoryToDto(c, allCategories));
    }

    public async Task<CategoriesDto> GetByIdAsync(int id)
    {
        var allCategories = await _unitOfWork.Categories.GetAllAsync();
        if (!allCategories.Any())
        {
            throw new KeyNotFoundException("No categories found.");
        }

        var category = allCategories.FirstOrDefault(c => c.Id == id);
        if (category is null)
        {
            throw new KeyNotFoundException($"Category with id {id} not found.");
        }

        return MapCategoryToDto(category, allCategories);
    }

    public async Task<CategoriesDto> CreateAsync(CategoriesDto categoryDto)
    {
        if (categoryDto is null)
        {
            throw new ArgumentNullException(nameof(categoryDto), "Category cannot be null.");
        }

        var newCategory = new Category()
        {
            Name = categoryDto.Name,
            Description = categoryDto.Description,
            ParentCategoryId = categoryDto.ParentCategoryId
        };

        var createdCategory = await _unitOfWork.Categories.CreateAsync(newCategory);
        await _unitOfWork.SaveChangesAsync();

        var allCategories = await _unitOfWork.Categories.GetAllAsync();
        return MapCategoryToDto(createdCategory, allCategories);
    }

    private CategoriesDto MapCategoryToDto(Category category, IEnumerable<Category> allCategories)
    {
        var dto = new CategoriesDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId
        };

        var subcategories = allCategories.Where(c => c.ParentCategoryId == category.Id);
        foreach (var sub in subcategories)
        {
            dto.SubCategories.Add(MapCategoryToDto(sub, allCategories));
        }

        return dto;
    }
}