namespace Nautilux_Auctions.Domain.Entities;

public class Authenticity
{
    public int Id { get; set; }
    public string? CertificateNumber { get; set; }
    public string? Authority { get; set; }
    public DateTime? CertificationDate { get; set; }
    public string? Description { get; set; }
    public string? DocumentUrls { get; set; }

    // Navigation properties
    public virtual ICollection<Listing> Listings { get; set; } = new List<Listing>();
}