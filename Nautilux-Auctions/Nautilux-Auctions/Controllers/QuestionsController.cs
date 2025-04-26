using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.QuestionsDtos;

namespace Nautilux_Auctions.Controllers;

[Controller, Route("api/questions")]
public class QuestionsController : Controller
{
    private readonly IQuestionsService _questionsService;
    
    public QuestionsController(IQuestionsService questionsService)
    {
        _questionsService = questionsService;
    }
    
    [HttpPost, Authorize]
    public async Task<IActionResult> AddQuestion([FromBody] QuestionDto question)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        if (question == null)
        {
            return BadRequest("Question data is required.");
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        question.AskerId = Guid.Parse(userId);

        var result = await _questionsService.AddQuestion(question);
        return CreatedAtAction(nameof(AddQuestion), new { id = result.Id }, result);
    }
    
    [HttpGet("{questionId}"), Authorize]
    public async Task<IActionResult> GetQuestionById(int questionId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestionById(questionId);
        if (result == null)
        {
            return NotFound("Question not found.");
        }
        return Ok(result);
    }
    
    [HttpGet, Authorize]
    public async Task<IActionResult> GetQuestions()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestions();
        if (result == null || !result.Any())
        {
            return NotFound("No questions found.");
        }
        return Ok(result);
    }
    
    [HttpGet("user/{userId}"), Authorize]
    public async Task<IActionResult> GetQuestionsByUserId(Guid userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestionsByUserId(userId);
        if (result == null || !result.Any())
        {
            return NotFound("No questions found.");
        }
        return Ok(result);
    }
    
    [HttpGet("listing/{listingId}"), Authorize]
    public async Task<IActionResult> GetQuestionsByListingId(int listingId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestionsByListingId(listingId);
        if (result == null || !result.Any())
        {
            return NotFound("No questions found.");
        }
        
        return Ok(result);
    }
    
    [HttpGet("seller/{sellerId}"), Authorize]
    public async Task<IActionResult> GetQuestionsBySellerId(Guid sellerId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestionsBySellerId(sellerId);
        if (result == null || !result.Any())
        {
            return NotFound("No questions found.");
        }
        return Ok(result);
    }
    
    [HttpPut, Authorize]
    public async Task<IActionResult> AnswerQuestion([FromBody] QuestionDto question)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var result = await _questionsService.AnswerQuestion(question);
        return Ok(result);
    }
    
    [HttpDelete("{questionId}"), Authorize]
    public async Task<IActionResult> DeleteQuestion(int questionId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        var result = await _questionsService.GetQuestionById(questionId);
        if (result == null)
        {
            return NotFound("No questions found.");
        }

        await _questionsService.DeleteQuestion(questionId);
        return NoContent();
    }
    
    [HttpGet("listing/{listingId}/seller/{userId}"), Authorize]
    public async Task<IActionResult> GetQuestionsByListingIdAndSellerId(int listingId, Guid userId)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        var result = await _questionsService.GetQuestionsByListingIdAndSellerId(listingId, userId);
        
        if (result == null || !result.Any())
        {
            return NotFound("No questions found.");
        }
        return Ok(result);
    }
}