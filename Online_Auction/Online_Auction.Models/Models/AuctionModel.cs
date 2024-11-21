using System.ComponentModel.DataAnnotations;
using Online_Auction.Models.Enums;

namespace Online_Auction.Models.Models;

public class AuctionModel
{
    [Key]
    public int Id { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public StatusTypes Status { get; set; }
}