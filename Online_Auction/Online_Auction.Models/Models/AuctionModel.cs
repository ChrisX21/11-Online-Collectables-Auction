using System.ComponentModel.DataAnnotations;
using Online_Auction.Models.Enums;

namespace Online_Auction.Models.Models;

public class AuctionModel
{
    [Key]
    public int Id { get; set; }
    [Required]
    public decimal StartingPrice { get; set; }
    [Required]
    public decimal CurrentPrice { get; set; }
    [Required]
    public DateTime StartTime { get; set; }
    [Required]
    public DateTime EndTime { get; set; }
    public StatusTypes Status { get; set; }
}