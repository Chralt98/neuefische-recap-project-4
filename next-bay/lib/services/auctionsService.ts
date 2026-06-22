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

export type ApiResponse<T> = {
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getAuctions(
  filter: QueryAuctionsOptions,
): Promise<Auction[]> {
  const params = new URLSearchParams();
  if (filter.status) params.append("status", filter.status);
  if (filter.minPrice) params.append("min-price", filter.minPrice.toString());
  if (filter.maxPrice) params.append("max-price", filter.maxPrice.toString());
  if (filter.page) params.append("page", filter.page.toString());
  if (filter.limit) params.append("limit", filter.limit.toString());

  const response = await fetch(
    `${process.env.DARKBAY_API_URL}/auctions?${new URLSearchParams(params)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch auctions: ${response.statusText}`);
  }

  const {
    data,
    meta: { page, limit, total, totalPages },
  } = (await response.json()) as ApiResponse<Auction[]>;

  return data;
}

export async function getAuctionById(id: string): Promise<Auction> {
  const response = await fetch(`${process.env.DARKBAY_API_URL}/auctions/${id}`);
  const auction = (await response.json()) as Auction;
  return auction;
}

export async function createAuction(
  dto: CreateAuction,
  jwt_token: string,
): Promise<Auction> {
  const response = await fetch(`${process.env.DARKBAY_API_URL}/auctions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt_token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    throw new Error(`Failed to create auction: ${response.statusText}`);
  }
  const createdAuction = (await response.json()) as Auction;
  return createdAuction;
}
