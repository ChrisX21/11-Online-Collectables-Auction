using Microsoft.EntityFrameworkCore;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Infrastructure.Repositories;

public class QuestionsRepository : IQuestionsRepository
{
    private readonly ApplicationDbContext _context;
    
    public QuestionsRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Question> AddQuestion(Question question)
    {
        await _context.Questions.AddAsync(question);
        return question;
    }

    public async Task<Question?> GetQuestionById(int questionId)
    {
        return await _context.Questions.FirstOrDefaultAsync(q => q.Id == questionId);
    }

    public async Task<List<Question>> GetQuestions()
    {
        return await _context.Questions.ToListAsync();
    }

    public async Task<List<Question>> GetQuestionsByUserId(Guid userId)
    {
        return await _context.Questions
            .Where(q => q.AskerId == userId)
            .ToListAsync();
    }

    public async Task<List<Question>> GetQuestionsByListingId(int listingId)
    {
        return await _context.Questions
            .Where(q => q.ListingId == listingId)
            .ToListAsync();
    }

    public async Task<List<Question>> GetQuestionsBySellerId(Guid sellerId)
    {
        return await _context.Questions
            .Where(q => q.Listing.SellerId == sellerId)
            .ToListAsync();
    }

    public async Task<Question> AnswerQuestion(Question question)
    {
        var questionEntry = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == question.Id);
        
        if (questionEntry == null)
        {
            throw new Exception("Question not found");
        }

        questionEntry.AnswerText = question.AnswerText;
        questionEntry.AnswerTimestamp = DateTime.UtcNow;

        _context.Questions.Update(questionEntry);
        await _context.SaveChangesAsync();

        return questionEntry;
    }
    
    public async Task<List<Question>> GetQuestionsByListingIdAndSellerId(int listingId, Guid userId)
    {
        return await _context.Questions
            .Where(q => q.ListingId == listingId && q.AskerId == userId)
            .ToListAsync();
    }

    public Task DeleteQuestion(Question question)
    {
         _context.Questions.Remove(question);
         return Task.CompletedTask;
    }

}