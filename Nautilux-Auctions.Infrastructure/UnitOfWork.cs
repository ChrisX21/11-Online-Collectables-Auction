using Nautilux_Auctions.Application.Abstracts;
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
        Bids = new BidsRepository(_context);
        Reviews = new ReviewsRepository(_context);
        Questions = new QuestionsRepository(_context);
        WishLists = new WishListRepository(_context);
    }

    public IListingRepository Listings { get; }
    public ICategoriesRepository Categories { get; }
    public IBidsRepository Bids { get; }
    public IReviewsRepository Reviews { get; } 
    public IQuestionsRepository Questions { get; }
    public IWishListRepository WishLists { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}