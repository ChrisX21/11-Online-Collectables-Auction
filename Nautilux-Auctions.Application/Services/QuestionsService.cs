using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.QuestionsDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class QuestionsService : IQuestionsService
{
    private readonly IUnitOfWork _unitOfWork;
    
    public QuestionsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    public async Task<QuestionDto> AddQuestion(QuestionDto question)
    {
        if(question is null || question.ListingId <= 0 || question.AskerId == Guid.Empty)
        {
            throw new ArgumentException("Invalid question data");
        }
        
        var questionEntity = new Question
        {
            ListingId = question.ListingId,
            AskerId = question.AskerId,
            QuestionText = question.QuestionText,
            QuestionTimestamp = DateTime.Now,
            IsPublic = question.IsPublic
        };
        
        await _unitOfWork.Questions.AddQuestion(questionEntity);
        await _unitOfWork.SaveChangesAsync();

        return new QuestionDto
        {
            Id = questionEntity.Id,
            ListingId = questionEntity.ListingId,
            AskerId = questionEntity.AskerId,
            QuestionText = questionEntity.QuestionText,
            QuestionTimestamp = questionEntity.QuestionTimestamp,
            IsPublic = questionEntity.IsPublic
        };
    }

    public async Task<QuestionDto?> GetQuestionById(int questionId)
    {
        if (questionId <= 0)
        {
            throw new ArgumentException("Invalid question data");
        }
        
        var questionEntity = await _unitOfWork.Questions.GetQuestionById(questionId);
        if (questionEntity == null)
        {
            return null;
        }
     
        return new QuestionDto
        {
            Id = questionEntity.Id,
            ListingId = questionEntity.ListingId,
            AskerId = questionEntity.AskerId,
            QuestionText = questionEntity.QuestionText,
            QuestionTimestamp = questionEntity.QuestionTimestamp,
            IsPublic = questionEntity.IsPublic,
            AnswerText = questionEntity.AnswerText,
            AnswerTimestamp = questionEntity.AnswerTimestamp
        };
    }

    public async Task<List<QuestionDto>> GetQuestions()
    {
        var questions = await _unitOfWork.Questions.GetQuestions();
        return questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            ListingId = q.ListingId,
            AskerId = q.AskerId,
            QuestionText = q.QuestionText,
            QuestionTimestamp = q.QuestionTimestamp,
            IsPublic = q.IsPublic,
            AnswerText = q.AnswerText,
            AnswerTimestamp = q.AnswerTimestamp
        }).ToList();
    }

    public async Task<List<QuestionDto>> GetQuestionsByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID");
        }
        var questions = await _unitOfWork.Questions.GetQuestionsByUserId(userId);
        return questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            ListingId = q.ListingId,
            AskerId = q.AskerId,
            QuestionText = q.QuestionText,
            QuestionTimestamp = q.QuestionTimestamp,
            IsPublic = q.IsPublic,
            AnswerText = q.AnswerText,
            AnswerTimestamp = q.AnswerTimestamp
        }).ToList();
    }

    public async Task<List<QuestionDto>> GetQuestionsByListingId(int listingId)
    {
        if (listingId <= 0)
        {
            throw new ArgumentException("Invalid listing ID");
        }
        var questions = await _unitOfWork.Questions.GetQuestionsByListingId(listingId);
        return questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            ListingId = q.ListingId,
            AskerId = q.AskerId,
            QuestionText = q.QuestionText,
            QuestionTimestamp = q.QuestionTimestamp,
            IsPublic = q.IsPublic,
            AnswerText = q.AnswerText,
            AnswerTimestamp = q.AnswerTimestamp
        }).ToList();
    }

    public async Task<List<QuestionDto>> GetQuestionsBySellerId(Guid sellerId)
    {
        if (sellerId == Guid.Empty)
        {
            throw new ArgumentException("Invalid seller ID");
        }
        var questions = await _unitOfWork.Questions.GetQuestionsBySellerId(sellerId);
        return questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            ListingId = q.ListingId,
            AskerId = q.AskerId,
            QuestionText = q.QuestionText,
            QuestionTimestamp = q.QuestionTimestamp,
            IsPublic = q.IsPublic,
            AnswerText = q.AnswerText,
            AnswerTimestamp = q.AnswerTimestamp
        }).ToList();
    }

    public async Task<QuestionDto> AnswerQuestion(QuestionDto question)
    {
        if (question is null || question.Id <= 0 || string.IsNullOrEmpty(question.AnswerText))
        {
            throw new ArgumentException("Invalid question data");
        }
        var questionEntity = await _unitOfWork.Questions.GetQuestionById(question.Id);
        
        if (questionEntity.AnswerTimestamp != null)
        {
            throw new InvalidOperationException("Question has already been answered");
        }
        questionEntity.AnswerText = question.AnswerText;
        questionEntity.AnswerTimestamp = DateTime.Now;
        
        await _unitOfWork.Questions.AnswerQuestion(questionEntity);
        await _unitOfWork.SaveChangesAsync();
        
        return new QuestionDto
        {
            Id = questionEntity.Id,
            ListingId = questionEntity.ListingId,
            AskerId = questionEntity.AskerId,
            QuestionText = questionEntity.QuestionText,
            QuestionTimestamp = questionEntity.QuestionTimestamp,
            IsPublic = questionEntity.IsPublic,
            AnswerText = questionEntity.AnswerText,
            AnswerTimestamp = questionEntity.AnswerTimestamp
        };
    }

    public async Task<List<QuestionDto>> GetQuestionsByListingIdAndSellerId(int listingId, Guid userId)
    {
        var questions = await _unitOfWork.Questions.GetQuestionsByListingIdAndSellerId(listingId, userId);
        return questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            ListingId = q.ListingId,
            AskerId = q.AskerId,
            QuestionText = q.QuestionText,
            QuestionTimestamp = q.QuestionTimestamp,
            IsPublic = q.IsPublic,
            AnswerText = q.AnswerText,
            AnswerTimestamp = q.AnswerTimestamp
        }).ToList();
    }

    public async Task DeleteQuestion(int questionId)
    {
        if (questionId <= 0)
        {
            throw new ArgumentException("Invalid question ID");
        }
        
        var question = await _unitOfWork.Questions.GetQuestionById(questionId);
        
        if (question == null)
        {
            throw new Exception("Question not found");
        }
        await _unitOfWork.Questions.DeleteQuestion(question);
        await _unitOfWork.SaveChangesAsync();
    }
}