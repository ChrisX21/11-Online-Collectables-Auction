using Nautilux_Auctions.Domain.DTO.QuestionsDtos;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IQuestionsService
{
    public Task<QuestionDto> AddQuestion(QuestionDto question);
    public Task<QuestionDto?> GetQuestionById(int questionId);
    public Task<List<QuestionDto>> GetQuestions();
    public Task<List<QuestionDto>> GetQuestionsByUserId(Guid userId);
    public Task<List<QuestionDto>> GetQuestionsByListingId(int listingId);
    public Task<List<QuestionDto>> GetQuestionsBySellerId(Guid sellerId);
    public Task<QuestionDto> AnswerQuestion(QuestionDto question);
    public Task<List<QuestionDto>> GetQuestionsByListingIdAndSellerId(int listingId, Guid userId);
    public Task DeleteQuestion(int questionId);
}