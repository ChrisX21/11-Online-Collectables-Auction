namespace Nautilux_Auctions.Application.Abstracts;

public interface IUnitOfWork : IDisposable
{
    IListingRepository Listings { get; }
    ICategoriesRepository Categories { get; }
    IBidsRepository Bids { get; }
    IReviewsRepository Reviews { get; }
    Task<int> SaveChangesAsync();
}
