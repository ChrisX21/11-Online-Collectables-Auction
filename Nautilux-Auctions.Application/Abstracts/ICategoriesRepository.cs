using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface ICategoriesRepository
{
    public Task<IEnumerable<Category>> GetAllAsync();
    public Task<Category> GetByIdAsync(int id);
    public Task<Category> GetCategoryByNameAsync(string title);
    public Task<Category> CreateAsync(Category category);
}