import { getAuctions } from "@/lib/services/auctionsService";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { isAuthenticated } from "../action";

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
  const isAuth = await isAuthenticated();
  const result = await getAuctions({
    status: params.status as "open" | "closed" | undefined,
    minPrice: params["min-price"] ? Number(params["min-price"]) : undefined,
    maxPrice: params["max-price"] ? Number(params["max-price"]) : undefined,
    page: params.page ? Number(params.page) : undefined,
    limit: params.limit ? Number(params.limit) : undefined,
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  const auctions = result.data;

  return (
    <div>
      {isAuth && (
        <Link
          href="/auction-list/new"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Create a new auction
        </Link>
      )}

      <h1 className="text-2xl font-bold my-4">Auction List</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <Card key={auction.id}>
            <CardHeader>
              <CardTitle>{auction.title}</CardTitle>
              <CardDescription>Sold by {auction.seller}</CardDescription>
            </CardHeader>
            {/* grid gap-2: stack items vertically with 8px spacing */}
            <CardContent className="grid gap-2">
              <p>Status: {auction.status}</p>
              <p>Current Price: {auction.currentPrice}</p>
              <p>Starting Price: {auction.startingPrice}</p>
              <p>End Date: {auction.endDate.toString()}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/auction-list/${auction.id}`}>View Details</Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
