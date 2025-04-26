using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Nautilux_Auctions.Application.Abstracts;

namespace Nautilux_Auctions.Hubs;

public class BidsHub : Hub
{
    private readonly IBidsService _bidsService;

    public BidsHub(IBidsService bidsService)
    {
        _bidsService = bidsService;
    }

    public async Task JoinListingRoom(int listingId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, listingId.ToString());
    }

    public async Task LeaveListingRoom(int listingId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, listingId.ToString());
    }

    public async Task PlaceBid(int listingId, decimal bidAmount)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("BidRejected", "You must be logged in to place a bid.");
            return;
        }

        var bidResult = await _bidsService.PlaceBid(listingId, bidAmount, Guid.Parse(userId));

        if (bidResult.IsSuccessful)
        {
            await Clients.Group(listingId.ToString()).SendAsync("ReceiveNewBid", bidResult.CurrentBid);
        }
        else
        {
            await Clients.Caller.SendAsync("BidRejected", bidResult.RejectReason);
        }
    }

    public async Task GetCurrentBid(int listingId)
    {
        var currentBid = await _bidsService.GetCurrentBid(listingId);
        await Clients.Caller.SendAsync("CurrentBid", currentBid);
    }
}