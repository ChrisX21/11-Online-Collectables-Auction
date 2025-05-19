import api from './axios';

export async function checkAndUpdateExpiredAuctions(): Promise<void> {
  try {
    const response = await api.get('/listings/active');
    const activeAuctions = response.data;
    
    const now = new Date();
    const expiredAuctions = activeAuctions.filter(
      (auction: any) => 
        // Only update auctions that aren't drafts
        auction.stringStatus !== "Draft" && 
        // And are expired
        new Date(auction.endDate) < now
    );
    
    for (const auction of expiredAuctions) {
      try {
        await api.put(`/listings/${auction.id}`, {
          ...auction,
          stringStatus: "Completed",
          listingId: Number(auction.id)
        });
        
        console.log(`Updated auction ${auction.id} to Completed status`);
      } catch (updateError) {
        console.error(`Failed to update auction ${auction.id}:`, updateError);
      }
    }
    
    if (expiredAuctions.length > 0) {
      console.log(`Updated ${expiredAuctions.length} expired auctions to Completed status`);
    }
  } catch (error) {
    console.error('Error checking expired auctions:', error);
  }
}

export function startAuctionStatusChecker(intervalMinutes = 5): () => void {
  checkAndUpdateExpiredAuctions();
  
  // set up interval
  const intervalId = setInterval(
    checkAndUpdateExpiredAuctions, 
    intervalMinutes * 60 * 1000
  );
  
  // return function to clear the interval
  return () => clearInterval(intervalId);
} 