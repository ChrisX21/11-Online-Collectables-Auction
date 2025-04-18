namespace Nautilux_Auctions.Domain.DTO.ImageDtos;

public class ImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public string? Caption { get; set; }
    public int DisplayOrder { get; set; }
}
