import { useState, useEffect, useCallback } from 'react';
import signalRService, { Bid } from '@/utils/signalr';
import { useAuth } from '@/context/AuthContext';

interface UseSignalRProps {
  listingId: number;
  onNewBid?: (bid: Bid) => void;
  onBidRejected?: (reason: string) => void;
  onCurrentBid?: (bid: Bid | null) => void;
}

interface UseSignalRReturn {
  isConnected: boolean;
  placeBid: (bidAmount: number) => Promise<boolean>;
  getCurrentBid: () => Promise<void>;
  currentBid: Bid | null;
  bidError: string | null;
}

export const useSignalR = ({
  listingId,
  onNewBid,
  onBidRejected,
  onCurrentBid
}: UseSignalRProps): UseSignalRReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
  
    const connect = async () => {
      try {
        // slight delay to let context/user/layout settle
        await new Promise(resolve => setTimeout(resolve, 50));
  
        await signalRService.start();
        if (!isMounted) return;
  
        setIsConnected(true);
  
        await signalRService.joinListingRoom(listingId);
  
        signalRService.onReceiveNewBid((bid) => {
          if (isMounted) {
            setCurrentBid(bid);
            onNewBid?.(bid);
          }
        });
  
        signalRService.onBidRejected((reason) => {
          if (isMounted) {
            setBidError(reason);
            onBidRejected?.(reason);
          }
        });
  
        signalRService.onCurrentBid((bid) => {
          if (isMounted) {
            setCurrentBid(bid);
            onCurrentBid?.(bid);
          }
        });
  
        await signalRService.getCurrentBid(listingId);
      } catch (err) {
        console.error('SignalR connection failed:', err);
        setIsConnected(false);
      }
    };
  
    connect();
  
    return () => {
      isMounted = false;
      signalRService.leaveListingRoom(listingId);
      signalRService.stop();
    };
  }, [listingId]);
  
  const placeBid = useCallback(async (bidAmount: number): Promise<boolean> => {
    setBidError(null);
    if (!user?.id) {
      setBidError("You must be logged in to place a bid.");
      return false;
    }

    const success = await signalRService.placeBid(listingId, bidAmount, user.id);
    return success;
  }, [listingId, user?.id]);

  const getCurrentBid = useCallback(async (): Promise<void> => {
    await signalRService.getCurrentBid(listingId);
  }, [listingId]);

  return {
    isConnected,
    placeBid,
    getCurrentBid,
    currentBid,
    bidError
  };
};

export default useSignalR;
