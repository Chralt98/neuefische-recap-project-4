import {
  getAuctionById,
  getAuctionOffers,
} from "@/lib/services/auctionsService";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { isAuthenticated } from "@/app/action";

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isAuth = await isAuthenticated();
  const auctionResult = await getAuctionById(id);
  if (!auctionResult.success) {
    throw new Error(auctionResult.error);
  }
  const auction = auctionResult.data;

  if (!auction) notFound();

  const result = await getAuctionOffers(id);
  if (!result.success) {
    throw new Error(`Failed to fetch offers: ${result.error}`);
  }
  const offers = result.data;

  return (
    // grid: CSS grid layout
    // gap-4: 16px gap between grid items
    // max-w-2xl: caps width at 672px
    // mx-auto: centers horizontally
    // w-full: takes full available width up to max-w
    <div className="grid gap-4 max-w-2xl mx-auto w-full">
      <Link href="/auction-list">&larr; Back to auctions</Link>
      <Card>
        <CardHeader>
          <CardTitle>{auction.title}</CardTitle>
          <CardDescription>Sold by {auction.seller}</CardDescription>
        </CardHeader>
        {/* grid gap-2: stack items vertically with 8px spacing */}
        <CardContent className="grid gap-2">
          <p>Status: {auction.status}</p>
          <p>Description: {auction.description}</p>
          <p>Current Price: {auction.currentPrice}</p>
          <p>Starting Price: {auction.startingPrice}</p>
          <p>End Date: {auction.endDate.toString()}</p>
          <p>Created At: {auction.createdAt.toString()}</p>
        </CardContent>
      </Card>

      {isAuth && auction.status === "open" && (
        <Link
          href={`/auction-list/${auction.id}/bid`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Place a bid
        </Link>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>{offers.length} bid(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length > 0 ? (
            // grid gap-3: stack offer items with 12px spacing
            <ul className="grid gap-3">
              {offers.map((offer) => (
                // flex justify-between: bidder left, amount right
                <li key={offer.id} className="flex justify-between">
                  <span>{offer.bidder}</span>
                  <span>{offer.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No offers yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
