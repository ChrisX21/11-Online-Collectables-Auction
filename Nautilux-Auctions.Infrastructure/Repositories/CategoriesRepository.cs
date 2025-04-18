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
        return await Task.FromResult(_context.Categories.AsEnumerable());
    }

    public async Task<Category> GetByIdAsync(int id)
    {
        return await _context.Categories.FindAsync(id) ?? throw new KeyNotFoundException($"Category with id {id} not found.");
    }

    public async Task<Category> CreateAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
        return category;
    }
}