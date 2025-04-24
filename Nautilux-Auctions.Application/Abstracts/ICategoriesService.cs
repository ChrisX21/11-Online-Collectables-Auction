using Nautilux_Auctions.Domain.DTO.CategoriesDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface ICategoriesService
{
    public Task<IEnumerable<CategoriesDto>> GetAllAsync();
    public Task<CategoriesDto> GetByIdAsync(int id);
    public Task<CategoriesDto> CreateAsync(CategoriesDto category);
}