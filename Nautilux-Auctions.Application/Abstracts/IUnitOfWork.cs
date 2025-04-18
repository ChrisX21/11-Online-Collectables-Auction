namespace Nautilux_Auctions.Application.Abstracts;

public interface IUnitOfWork : IDisposable
{
    IListingRepository Listings { get; }
    ICategoriesRepository Categories { get; }
    Task<int> SaveChangesAsync();
}
