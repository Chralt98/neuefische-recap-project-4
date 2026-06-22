export type AuctionStatus = "open" | "closed";

export type Auction = {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endDate: Date;
  createdAt: Date;
  seller: string;
  status: AuctionStatus;
};

export type CreateAuction = {
  title: string;
  description: string;
  startingPrice: number;
  endDate?: Date;
};

export type QueryAuctionsOptions = {
  status?: AuctionStatus;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

export function getAuctions(filter: QueryAuctionsOptions): Auction[] {
  return [];
}

export function getAuctionById(id: string): Auction {
  return auction;
}

export function createAuction(dto: CreateAuction): Auction {
  return auction;
}
