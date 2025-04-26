using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Abstracts;

public interface IQuestionsRepository
{
    public Task<Question> AddQuestion(Question question);
    public Task<Question?> GetQuestionById(int questionId);
    public Task<List<Question>> GetQuestions();
    public Task<List<Question>> GetQuestionsByUserId(Guid userId);
    public Task<List<Question>> GetQuestionsByListingId(int listingId);
    public Task<List<Question>> GetQuestionsBySellerId(Guid sellerId);
    public Task<Question> AnswerQuestion(Question question);
    public Task<List<Question>> GetQuestionsByListingIdAndSellerId(int listingId, Guid userId);
    public Task DeleteQuestion(Question question);
}