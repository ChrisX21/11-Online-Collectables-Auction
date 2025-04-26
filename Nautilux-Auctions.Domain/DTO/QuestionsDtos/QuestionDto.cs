namespace Nautilux_Auctions.Domain.DTO.QuestionsDtos;

public class QuestionDto
{
    public int Id { get; set; }
    public Guid AskerId { get; set; }
    public int ListingId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? AnswerText { get; set; }
    public DateTime QuestionTimestamp { get; set; }
    public DateTime? AnswerTimestamp { get; set; }
    public bool IsPublic { get; set; } = true;
}