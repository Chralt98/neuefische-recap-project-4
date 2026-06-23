import { fetchAPI } from "../fetchAPI";

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

export type Offer = {
  id: string;
  amount: number;
  createdAt: Date;
  bidder: string;
  auctionId: string;
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

  const response = await fetchAPI(`/auctions?${params.toString()}`, {});

  if (!response.ok) {
    throw new Error(`Failed to fetch auctions: ${response.statusText}`);
  }

  const {
    data,
    meta: { page, limit, total, totalPages },
  } = (await response.json()) as ApiResponse<Auction[]>;

  return data;
}

export async function getAuctionById(id: string): Promise<Auction | null> {
  const response = await fetchAPI(`/auctions/${id}`, {});
  if (response.status === 404) {
    return null; // Not found
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch auction: ${response.statusText}`);
  }

  const auction = (await response.json()) as Auction;
  return auction;
}

export async function createAuction(dto: CreateAuction): Promise<Auction> {
  const response = await fetchAPI("/auctions", {
    body: JSON.stringify(dto),
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to create auction: ${response.statusText}`);
  }
  const createdAuction = (await response.json()) as Auction;
  return createdAuction;
}

export async function getAuctionOffers(auctionId: string): Promise<Offer[]> {
  const response = await fetchAPI(`/auctions/${auctionId}/offers`, {});

  if (!response.ok) {
    throw new Error(`Failed to fetch offers: ${response.statusText}`);
  }

  const offers = (await response.json()) as Offer[];
  return offers;
}

// Design question: Why route every backend call through one server-side module instead of calling fetch inside each component? Think about where your API URL and, later, your auth token need to live.
// Answer: Centralizing all backend calls in one module has several advantages:
// 1. Single Source of Truth: It provides a single source of truth for all API interactions, making it easier to manage and update the API URL or any common headers (like auth tokens) in one place.
// 2. Reusability: It promotes code reusability, as multiple components can import and use the same functions to interact with the backend, reducing code duplication.
// 3. Error Handling: It allows for consistent error handling across all API calls, as you can implement common error handling logic within this module.
// 4. Testing: It makes testing easier, as you can mock the functions in this module during unit tests without having to mock fetch calls in every component.
// 5. Separation of Concerns: It keeps the components focused on rendering UI and managing state, while the service module handles all data fetching and business logic related to API interactions.
