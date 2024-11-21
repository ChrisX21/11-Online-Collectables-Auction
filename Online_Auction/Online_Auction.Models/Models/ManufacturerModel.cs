using System.ComponentModel.DataAnnotations;

namespace Online_Auction.Models.Models;

public class ManufacturerModel
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string LogoUrl { get; set; }
}