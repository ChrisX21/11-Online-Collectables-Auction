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
    
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        var allCategories = await _unitOfWork.Categories.GetAllAsync();
        if(allCategories is null || !allCategories.Any())
        {
            throw new KeyNotFoundException("No categories found.");
        }
        
        return allCategories;
    }

    public Task<Category> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<Category> CreateAsync(CategoriesDto category)
    {
        if (category is null)
        {
            throw new ArgumentNullException(nameof(category), "Category cannot be null.");
        }

        var newCategory = new Category()
        {
            Name = category.Name,
            Description = category.Description,
        };
        
        var createdCategory = await _unitOfWork.Categories.CreateAsync(newCategory);
        await _unitOfWork.SaveChangesAsync();
        
        return createdCategory;
    }
}