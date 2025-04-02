using System.ComponentModel.DataAnnotations.Schema;

namespace Nautilux_Auctions.Domain.Entities;

public class Question
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public Guid AskerId { get; set; }
    public required string QuestionText { get; set; }
    public string? AnswerText { get; set; }
    public DateTime QuestionTimestamp { get; set; }
    public DateTime? AnswerTimestamp { get; set; }
    public bool IsPublic { get; set; } = true;

    // Navigation properties
    [ForeignKey("ListingId")]
    public virtual Listing Listing { get; set; } = null!;
        
    [ForeignKey("AskerId")]
    public virtual User Asker { get; set; } = null!;
}
