import { getAuctions } from "@/lib/services/auctionsService";
import Link from "next/link";

/*
This is about where you store UI state like the current page number or filter selections.

URL searchParams approach (/auction-list?page=2&status=open):

- State lives in the URL, read via searchParams in a server component
- Users can bookmark/share a filtered view
- Browser back/forward navigates between filter states
- The page works without JavaScript (server-rendered)

Client-side useState approach:

- State lives in React memory
- Lost on refresh, can't be shared or bookmarked
- Requires client components and useEffect to fetch data

The takeaway: 
For filters and pagination, URL searchParams is almost always better because the state is inherently "shareable" — 
it describes what the user is looking at, not how the UI works internally. 
That's why Next.js server components give you searchParams as a prop directly.
*/

type SearchParams = {
  status?: string;
  "min-price"?: string;
  "max-price"?: string;
  page?: string;
  limit?: string;
};

export default async function AuctionList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const auctions = await getAuctions({
    status: params.status as "open" | "closed" | undefined,
    minPrice: params["min-price"] ? Number(params["min-price"]) : undefined,
    maxPrice: params["max-price"] ? Number(params["max-price"]) : undefined,
    page: params.page ? Number(params.page) : undefined,
    limit: params.limit ? Number(params.limit) : undefined,
  });

  return (
    <div>
      {auctions.map((auction) => (
        <div key={auction.id}>
          <h1>Auction: {auction.title}</h1>
          <p>ID: {auction.id}</p>
          <p>Status: {auction.status}</p>
          <p>Description: {auction.description}</p>
          <p>End Date: {auction.endDate.toString()}</p>
          <p>Starting Price: {auction.startingPrice}</p>
          <p>Current Price: {auction.currentPrice}</p>
          <p>Seller: {auction.seller}</p>
          <p>Created At: {auction.createdAt.toString()}</p>
          <Link href={`/auction-list/${auction.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
