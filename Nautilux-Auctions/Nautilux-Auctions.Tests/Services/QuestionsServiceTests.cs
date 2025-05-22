using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Application.Services;
using Nautilux_Auctions.Domain.DTO.QuestionsDtos;
using Nautilux_Auctions.Domain.Entities;
using NUnit.Framework;

namespace Nautilux_Auctions.Tests.Services
{
    [TestFixture]
    public class QuestionsServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IQuestionsRepository> _mockQuestionsRepository;
        private QuestionsService _questionsService;

        [SetUp]
        public void Setup()
        {
            _mockQuestionsRepository = new Mock<IQuestionsRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            _mockUnitOfWork.Setup(u => u.Questions).Returns(_mockQuestionsRepository.Object);

            _questionsService = new QuestionsService(_mockUnitOfWork.Object);
        }

        [Test]
        public async Task AddQuestion_WithValidData_ReturnsQuestionDto()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var questionDto = new QuestionDto
            {
                ListingId = 1,
                AskerId = userId,
                QuestionText = "Is this item still available?",
                IsPublic = true
            };

            Question capturedQuestion = null;
            _mockQuestionsRepository.Setup(repo => repo.AddQuestion(It.IsAny<Question>()))
                .Callback<Question>(q => capturedQuestion = q)
                .ReturnsAsync((Question q) => 
                {
                    q.Id = 1; // Simulate database assigning ID
                    return q;
                });

            // Act
            var result = await _questionsService.AddQuestion(questionDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.ListingId.Should().Be(questionDto.ListingId);
            result.AskerId.Should().Be(questionDto.AskerId);
            result.QuestionText.Should().Be(questionDto.QuestionText);
            result.IsPublic.Should().Be(questionDto.IsPublic);
            result.QuestionTimestamp.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMinutes(1));

            capturedQuestion.Should().NotBeNull();
            capturedQuestion.ListingId.Should().Be(questionDto.ListingId);
            capturedQuestion.AskerId.Should().Be(questionDto.AskerId);

            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public void AddQuestion_WithInvalidData_ThrowsArgumentException()
        {
            // Arrange
            var invalidQuestion = new QuestionDto
            {
                // Missing required fields
                ListingId = 0,
                AskerId = Guid.Empty
            };

            // Act & Assert
            FluentActions.Invoking(() => _questionsService.AddQuestion(invalidQuestion))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question data");
        }

        [Test]
        public async Task GetQuestionById_WithValidId_ReturnsQuestionDto()
        {
            // Arrange
            var questionId = 1;
            var userId = Guid.NewGuid();
            var question = new Question
            {
                Id = questionId,
                ListingId = 1,
                AskerId = userId,
                QuestionText = "Is this item still available?",
                QuestionTimestamp = DateTime.Now.AddDays(-1),
                IsPublic = true,
                AnswerText = "Yes, it is!",
                AnswerTimestamp = DateTime.Now
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync(question);

            // Act
            var result = await _questionsService.GetQuestionById(questionId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(questionId);
            result.ListingId.Should().Be(question.ListingId);
            result.AskerId.Should().Be(question.AskerId);
            result.QuestionText.Should().Be(question.QuestionText);
            result.QuestionTimestamp.Should().Be(question.QuestionTimestamp);
            result.IsPublic.Should().Be(question.IsPublic);
            result.AnswerText.Should().Be(question.AnswerText);
            result.AnswerTimestamp.Should().Be(question.AnswerTimestamp);
        }

        [Test]
        public async Task GetQuestionById_WithInvalidId_ReturnsNull()
        {
            // Arrange
            var questionId = 999;

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync((Question)null);

            // Act
            var result = await _questionsService.GetQuestionById(questionId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public void GetQuestionById_WithZeroId_ThrowsArgumentException()
        {
            // Arrange
            var invalidId = 0;

            // Act & Assert
            FluentActions.Invoking(() => _questionsService.GetQuestionById(invalidId))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question data");
        }

        [Test]
        public async Task GetQuestions_ReturnsAllQuestions()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    ListingId = 1,
                    AskerId = userId,
                    QuestionText = "Question 1",
                    QuestionTimestamp = DateTime.Now.AddDays(-2),
                    IsPublic = true
                },
                new Question
                {
                    Id = 2,
                    ListingId = 2,
                    AskerId = userId,
                    QuestionText = "Question 2",
                    QuestionTimestamp = DateTime.Now.AddDays(-1),
                    IsPublic = true,
                    AnswerText = "Answer to Question 2",
                    AnswerTimestamp = DateTime.Now
                }
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestions())
                .ReturnsAsync(questions);

            // Act
            var result = await _questionsService.GetQuestions();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result[0].Id.Should().Be(1);
            result[0].QuestionText.Should().Be("Question 1");
            result[1].Id.Should().Be(2);
            result[1].AnswerText.Should().Be("Answer to Question 2");
        }

        [Test]
        public async Task GetQuestionsByUserId_ReturnsUserQuestions()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    ListingId = 1,
                    AskerId = userId,
                    QuestionText = "Question 1",
                    QuestionTimestamp = DateTime.Now.AddDays(-1),
                    IsPublic = true
                },
                new Question
                {
                    Id = 2,
                    ListingId = 2,
                    AskerId = userId,
                    QuestionText = "Question 2",
                    QuestionTimestamp = DateTime.Now,
                    IsPublic = true
                }
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionsByUserId(userId))
                .ReturnsAsync(questions);

            // Act
            var result = await _questionsService.GetQuestionsByUserId(userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(q => q.AskerId == userId).Should().BeTrue();
        }

        [Test]
        public void GetQuestionsByUserId_WithEmptyGuid_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _questionsService.GetQuestionsByUserId(Guid.Empty))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid user ID");
        }

        [Test]
        public async Task GetQuestionsByListingId_ReturnsListingQuestions()
        {
            // Arrange
            var listingId = 1;
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    ListingId = listingId,
                    AskerId = Guid.NewGuid(),
                    QuestionText = "Question 1",
                    QuestionTimestamp = DateTime.Now.AddDays(-1),
                    IsPublic = true
                },
                new Question
                {
                    Id = 2,
                    ListingId = listingId,
                    AskerId = Guid.NewGuid(),
                    QuestionText = "Question 2",
                    QuestionTimestamp = DateTime.Now,
                    IsPublic = true
                }
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionsByListingId(listingId))
                .ReturnsAsync(questions);

            // Act
            var result = await _questionsService.GetQuestionsByListingId(listingId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(q => q.ListingId == listingId).Should().BeTrue();
        }

        [Test]
        public void GetQuestionsByListingId_WithInvalidId_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _questionsService.GetQuestionsByListingId(0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid listing ID");
        }
        

        [Test]
        public void GetQuestionsBySellerId_WithEmptyGuid_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _questionsService.GetQuestionsBySellerId(Guid.Empty))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid seller ID");
        }

        [Test]
        public async Task AnswerQuestion_WithValidData_ReturnsUpdatedQuestionDto()
        {
            // Arrange
            var questionId = 1;
            var existingQuestion = new Question
            {
                Id = questionId,
                ListingId = 1,
                AskerId = Guid.NewGuid(),
                QuestionText = "Is this item still available?",
                QuestionTimestamp = DateTime.Now.AddDays(-1),
                IsPublic = true
            };

            var questionDto = new QuestionDto
            {
                Id = questionId,
                AnswerText = "Yes, it's still available."
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync(existingQuestion);

            _mockQuestionsRepository.Setup(repo => repo.AnswerQuestion(It.IsAny<Question>()))
                .ReturnsAsync((Question q) => q);

            // Act
            var result = await _questionsService.AnswerQuestion(questionDto);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(questionId);
            result.AnswerText.Should().Be(questionDto.AnswerText);
            result.AnswerTimestamp.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMinutes(1));

            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public void AnswerQuestion_WithAlreadyAnsweredQuestion_ThrowsInvalidOperationException()
        {
            // Arrange
            var questionId = 1;
            var existingQuestion = new Question
            {
                Id = questionId,
                ListingId = 1,
                AskerId = Guid.NewGuid(),
                QuestionText = "Is this item still available?",
                QuestionTimestamp = DateTime.Now.AddDays(-1),
                AnswerText = "Yes, it is.",
                AnswerTimestamp = DateTime.Now.AddHours(-1),
                IsPublic = true
            };

            var questionDto = new QuestionDto
            {
                Id = questionId,
                AnswerText = "New answer."
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync(existingQuestion);

            // Act & Assert
            FluentActions.Invoking(() => _questionsService.AnswerQuestion(questionDto))
                .Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Question has already been answered");
        }

        [Test]
        public async Task GetQuestionsByListingIdAndSellerId_ReturnsFilteredQuestions()
        {
            // Arrange
            var listingId = 1;
            var userId = Guid.NewGuid();
            var questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    ListingId = listingId,
                    AskerId = userId,
                    QuestionText = "Question 1",
                    QuestionTimestamp = DateTime.Now.AddDays(-1),
                    IsPublic = true
                },
                new Question
                {
                    Id = 2,
                    ListingId = listingId,
                    AskerId = userId,
                    QuestionText = "Question 2",
                    QuestionTimestamp = DateTime.Now,
                    IsPublic = true
                }
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionsByListingIdAndSellerId(listingId, userId))
                .ReturnsAsync(questions);

            // Act
            var result = await _questionsService.GetQuestionsByListingIdAndSellerId(listingId, userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            result.All(q => q.ListingId == listingId && q.AskerId == userId).Should().BeTrue();
        }

        [Test]
        public async Task DeleteQuestion_WithValidId_CallsRepositoryAndSavesChanges()
        {
            // Arrange
            var questionId = 1;
            var question = new Question
            {
                Id = questionId,
                ListingId = 1,
                AskerId = Guid.NewGuid(),
                QuestionText = "Test question",
                QuestionTimestamp = DateTime.Now.AddDays(-1)
            };

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync(question);

            // Act
            await _questionsService.DeleteQuestion(questionId);

            // Assert
            _mockQuestionsRepository.Verify(repo => repo.DeleteQuestion(question), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public void DeleteQuestion_WithInvalidId_ThrowsArgumentException()
        {
            // Act & Assert
            FluentActions.Invoking(() => _questionsService.DeleteQuestion(0))
                .Should().ThrowAsync<ArgumentException>()
                .WithMessage("Invalid question ID");
        }

        [Test]
        public void DeleteQuestion_WithNonExistentQuestion_ThrowsException()
        {
            // Arrange
            var questionId = 999;

            _mockQuestionsRepository.Setup(repo => repo.GetQuestionById(questionId))
                .ReturnsAsync((Question)null);

            // Act & Assert
            FluentActions.Invoking(() => _questionsService.DeleteQuestion(questionId))
                .Should().ThrowAsync<Exception>()
                .WithMessage("Question not found");
        }
    }
}