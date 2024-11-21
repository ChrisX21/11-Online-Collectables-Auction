using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Online_Auction.Models.Constants;
using Online_Auction.Models.Enums;

namespace Online_Auction.Models.Models;

public class VehicleModel
{
    public VehicleModel()
    {
        Images = new List<string>();
        Features = new List<string>();
    }
    
    [Key]
    public int Id { get; set; }
    [Required]
    [ForeignKey(nameof(Manufacturer))]
    public int ManufacturerId { get; set; }
    [Required]
    public string Model { get; set; }
    [Required]
    public int Year { get; set; }
    public double Weight { get; set; }
    public int Capacity { get; set; }
    [Required]
    public EngineTypes EngineType { get; set; }
    [Required]
    public FuelType FuelType { get; set; }
    public int HorsePower { get; set; }
    [Required]
    public ICollection<string> Images { get; set; }
    [Required]
    [MaxLength((VehicleConstants.MaxLengthDescription))]
    public string Description { get; set; }
    public HullMaterials HullMaterial { get; set; }
    public ICollection<string> Features { get; set; }
    public ManufacturerModel Manufacturer { get; set; }
}