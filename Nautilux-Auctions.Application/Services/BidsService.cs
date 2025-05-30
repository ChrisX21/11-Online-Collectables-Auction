using Nautilux_Auctions.Application.Abstracts;
using Nautilux_Auctions.Domain.DTO.BidsDto;
using Nautilux_Auctions.Domain.Entities;

namespace Nautilux_Auctions.Application.Services;

public class BidsService : IBidsService
{
    private readonly IUnitOfWork _unitOfWork;

    public BidsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    public async Task<BidResult> PlaceBid(int listingId, decimal bidAmount, Guid userId)
    {
        var highestBid = await _unitOfWork.Bids.GetHighestBidForListing(listingId);

        if (highestBid != null && bidAmount <= highestBid.Amount)
        {
            return new BidResult
            {
                IsSuccessful = false,
                RejectReason = "Bid amount must be higher than the current highest bid"
            };
        }
        
        var newBid = new Bid
        {
            ListingId = listingId,
            BidderId = userId,
            Amount = bidAmount,
            Timestamp = DateTime.UtcNow
        };

        await _unitOfWork.Bids.SaveBid(newBid);
        await _unitOfWork.SaveChangesAsync();

        return new BidResult
        {
            IsSuccessful = true,
            CurrentBid = new BidDto
            {
                listingId = newBid.ListingId,
                UserId = newBid.BidderId,
                Amount = newBid.Amount,
                Timestamp = newBid.Timestamp
            }
        };
    }

    public async Task<BidResult> GetCurrentBid(int listingId)
    {
        var highestBid = await _unitOfWork.Bids.GetHighestBidForListing(listingId);

        if (highestBid == null)
        {
            return new BidResult
            {
                IsSuccessful = true,
                CurrentBid = null
            };
        }

        return new BidResult
        {
            IsSuccessful = true,
            CurrentBid = new BidDto
            {
                listingId = highestBid.ListingId,
                UserId = highestBid.BidderId,
                Amount = highestBid.Amount,
                Timestamp = highestBid.Timestamp
            }
        };
    }
    
    public async Task<IEnumerable<BidDto>> GetAllBidsForUser(Guid userId)
    {
        var bids = await _unitOfWork.Bids.GetAllBidsForUser(userId);
        
        return bids.Select(b => new BidDto
        {
            listingId = b.ListingId,
            BidId = b.Id,
            UserId = b.BidderId,
            Amount = b.Amount,
            Timestamp = b.Timestamp
        }).ToList();
    }

}