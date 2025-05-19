using Nautilux_Auctions.Domain.DTO.BidsDto;
using Nautilux_Auctions.Domain.DTO.ImageDtos;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Domain.DTO.ListingDtos;

public class ListingResponseDto
{
    public int ListingId { get; set; }
    public string Title { get; set; } 
    public string Description { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal? ReservePrice { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public ListingCondition Condition { get; set; }
    public string StringCondition { get; set; }
    public string? Origin { get; set; }
    public int? Year { get; set; }
    public string? Dimensions { get; set; }
    public string? Materials { get; set; }
    public int? AuthenticityId { get; set; }
    public ShippingOption ShippingOptions { get; set; }
    public string StringShippingOptions { get; set; }
    public int CategoryId { get; set; }
    public Guid SellerId { get; set; }
    public ListingStatus Status { get; set; }
    public string StringStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public BidDto CurrentBid { get; set; } = null!;
    public ICollection<ImageResponseDto> Images { get; set; } = new List<ImageResponseDto>();
}