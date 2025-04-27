using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class CategoriesRepository : ICategoriesRepository
{
    private readonly ApplicationDbContext _context;
    
    public CategoriesRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _context.Categories
            .Include(c => c.Subcategories)
            .ToListAsync();;
    }

    public async Task<Category> GetByIdAsync(int id)
    {
        return await _context.Categories
            .Include(c => c.Subcategories)
            .FirstOrDefaultAsync(c => c.Id == id) ?? throw new KeyNotFoundException($"Category with id {id} not found.");    }

    public async Task<Category> GetCategoryByNameAsync(string title)
    {
        return await _context.Categories
            .Where(c => c.Name == title)
            .FirstOrDefaultAsync() ?? throw new KeyNotFoundException($"Category with name {title} not found.");
    }
    public async Task<Category> CreateAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
        return category;
    }
}