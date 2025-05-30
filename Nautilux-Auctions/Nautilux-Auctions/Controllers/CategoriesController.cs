using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.CategoriesDtos;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Controllers;

[ApiController]
[Route("/api/categories")]
public class CategoriesController : Controller
{
    public readonly ICategoriesService _categoriesService;
    
    public CategoriesController(ICategoriesService categoriesService)
    {
        _categoriesService = categoriesService;
    }
    
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoriesService.GetAllAsync();
        if (categories == null || !categories.Any())
        {
            return NotFound("No categories found.");
        }
        return Ok(categories);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateCategory([FromBody] CategoriesDto category)
    {
        var createdCategory = _categoriesService.CreateAsync(category);
        if (createdCategory == null)
        {
            return BadRequest("Failed to create category.");
        }
        var response = new CategoriesDto
        {
            Id = createdCategory.Result.Id,
            Name = createdCategory.Result.Name,
            Description = createdCategory.Result.Description,
        };
        return CreatedAtAction(nameof(GetCategories), new { id = createdCategory.Id }, response);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetCategoryById(int id)
    {
        var category = _categoriesService.GetByIdAsync(id);
        if (category == null)
        {
            return NotFound($"Category with id {id} not found.");
        }

        var response = new CategoriesDto
        {
            Id = category.Result.Id,
            Name = category.Result.Name,
            Description = category.Result.Description,
        };
        
        return Ok(response);
    }
}