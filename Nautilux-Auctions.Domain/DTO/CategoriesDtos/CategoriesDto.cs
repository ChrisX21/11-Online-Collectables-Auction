namespace Nautilux_Auctions.Domain.DTO.CategoriesDtos;

public class CategoriesDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}