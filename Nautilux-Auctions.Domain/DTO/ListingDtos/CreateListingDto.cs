using Nautilux_Auctions.Domain.DTO.ImageDtos;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Domain.DTO.ListingDtos;

public class CreateListingDto
{
    public int ListingId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public string StringCondition { get; set; }
    public string? Origin { get; set; }
    public int? Year { get; set; }
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public int? AuthenticityId { get; set; }
    public string StringShippingOptions { get; set; }
    public int CategoryId { get; set; }
    public Guid SellerId { get; set; }
    public string StringStatus { get; set; }
    public ICollection<ImageDto> Images { get; set; } = new List<ImageDto>();
}