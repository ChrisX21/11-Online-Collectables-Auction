import * as signalR from '@microsoft/signalr';

export interface Bid {
  bidId: number;
  listingId: number;
  userId: string;
  amount: number;
  timestamp: string;
  userName?: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private currentListingId: number | null = null;

  public async start(): Promise<void> {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7107/bids', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
  
      this.registerReconnectionHandlers();
    }
  
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }
  
    if (
      this.connection.state === signalR.HubConnectionState.Connecting ||
      this.connection.state === signalR.HubConnectionState.Reconnecting
    ) {
      console.log('SignalR is in progress. Waiting for stable connection...');
      while (
        this.connection.state === signalR.HubConnectionState.Connecting ||
        this.connection.state === signalR.HubConnectionState.Reconnecting
      ) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
  
      if (this.connection.state === signalR.HubConnectionState.Connected) {
        console.log('SignalR connected after waiting.');
        return;
      }
    }
  
    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error:', err);
      this.connection = null;
      throw new Error('Failed to start SignalR connection');
    }
  }
  
  

  private registerReconnectionHandlers() {
    this.connection?.onreconnected(async (connectionId) => {
      console.log('Reconnected to SignalR server. Connection ID:', connectionId);
      if (this.currentListingId !== null) {
        console.log(`Rejoining listing room: ${this.currentListingId}`);
        await this.joinListingRoom(this.currentListingId);
      }
    });
  }

  private async ensureConnection(): Promise<void> {
    await this.start();
  
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR connection is not established');
    }
  }
  

  public async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.currentListingId = null;
    }
  }

  public async joinListingRoom(listingId: number): Promise<void> {
    try {
      await this.ensureConnection();
  
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.error('Connection not ready. Skipping room join.');
        return;
      }
  
      await this.connection.invoke('JoinListingRoom', listingId);
      this.currentListingId = listingId;
      console.log(`Joined listing room: ${listingId}`);
    } catch (err) {
      console.error(`Error joining listing room: ${listingId}`, err);
    }
  }
  

  public async leaveListingRoom(listingId: number): Promise<void> {
    try {
      await this.ensureConnection();
      await this.connection!.invoke('LeaveListingRoom', listingId);
      if (this.currentListingId === listingId) {
        this.currentListingId = null;
      }
      console.log(`Left listing room: ${listingId}`);
    } catch (err) {
      console.error(`Error leaving listing room: ${listingId}`, err);
    }
  }

  public async placeBid(listingId: number, bidAmount: number, userId: string): Promise<boolean> {
    try {
      await this.ensureConnection();
      if (this.connection?.state !== signalR.HubConnectionState.Connected) {
        console.warn('Cannot place bid: SignalR not connected.');
        return false;
      }
      await this.connection!.invoke('PlaceBid', listingId, bidAmount, userId);
      return true;
    } catch (err) {
      console.error(`Error placing bid: ${bidAmount} for listing: ${listingId}`, err);
      return false;
    }
  }

  public async getCurrentBid(listingId: number): Promise<void> {
    try {
      await this.ensureConnection();
      if (this.connection?.state !== signalR.HubConnectionState.Connected) {
        console.warn('Cannot get current bid: SignalR not connected.');
        return;
      }
      await this.connection!.invoke('GetCurrentBid', listingId);
    } catch (err) {
      console.error(`Error getting current bid for listing: ${listingId}`, err);
    }
  }

  public onReceiveNewBid(callback: (bid: Bid) => void): void {
    this.connection?.on('ReceiveNewBid', callback);
  }

  public onBidRejected(callback: (reason: string) => void): void {
    this.connection?.on('BidRejected', callback);
  }

  public onCurrentBid(callback: (bid: Bid | null) => void): void {
    this.connection?.on('CurrentBid', callback);
  }

  public getConnectionStatus(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

const signalRService = new SignalRService();
export default signalRService;
