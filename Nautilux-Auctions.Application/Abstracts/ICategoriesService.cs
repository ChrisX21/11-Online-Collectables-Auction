using Nautilux_Auctions.Domain.DTO.CategoriesDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface ICategoriesService
{
    public Task<IEnumerable<Category>> GetAllAsync();
    public Task<Category> GetByIdAsync(int id);
    public Task<Category> CreateAsync(CategoriesDto category);
}