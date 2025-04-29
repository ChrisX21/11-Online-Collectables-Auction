namespace Nautilux_Auctions.Domain.DTO.WishListDtos;

public class WishListDto
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public Guid UserId { get; set; }
    public DateTime AddedDate { get; set; }
}