using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Infrastructure.Repositories;

namespace Nautilux_Auctions.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Listings = new ListingRepository(_context);
        Categories = new CategoriesRepository(_context);
    }

    public IListingRepository Listings { get; }
    public ICategoriesRepository Categories { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}