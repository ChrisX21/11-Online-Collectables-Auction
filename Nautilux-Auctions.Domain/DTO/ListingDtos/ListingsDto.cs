using Nautilux_Auctions.Domain.Entities;
using Nautilux_Auctions.Domain.Enums;

namespace Nautilux_Auctions.Domain.DTO.ListingDtos;

public class ListingsDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal StartingPrice { get; set; }
    public Image? Image { get; set; }
    public Bid? CurrentBid { get; set; }
    public DateTime EndDate { get; set; }
    public ListingStatus Status { get; set; }
    public string StringStatus { get; set; }
}