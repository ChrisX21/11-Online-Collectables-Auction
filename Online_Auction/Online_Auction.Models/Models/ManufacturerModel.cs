using System.ComponentModel.DataAnnotations;

namespace Online_Auction.Models.Models;

public class ManufacturerModel
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = null!;
    public string LogoUrl { get; set; } = null!;
}