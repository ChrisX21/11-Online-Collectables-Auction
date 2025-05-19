using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nautilux_Auctions.Application.Abstracts;

namespace Nautilux_Auctions.Controllers;

[Route("api/bids")]
[ApiController]
public class BidsController : Controller
{
    private readonly IBidsService _bidsService;
    public BidsController(IBidsService bidsService)
    {
        _bidsService = bidsService;
    }
    
    [HttpGet, Authorize]
    public async Task<IActionResult> GetBids()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var bids = await _bidsService.GetAllBidsForUser(userId);
        if (bids == null || !bids.Any())
        {
            return NotFound("No bids found.");
        }
        return Ok(bids);
    }
    
    
}