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

export async function getAuctions(
  filter: QueryAuctionsOptions,
): Promise<Auction[]> {
  const response = await fetch(
    `${process.env.DARKBAY_API_URL}/auctions?page=${1}&limit=${10}`,
  );

  console.log("Response: ", response);
  return [];
}

getAuctions({
  status: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  page: undefined,
  limit: undefined,
});

// export async function getAuctionById(id: string): Promise<Auction> {
//   return auction;
// }

// export async function createAuction(dto: CreateAuction): Promise<Auction> {
//   return auction;
// }
