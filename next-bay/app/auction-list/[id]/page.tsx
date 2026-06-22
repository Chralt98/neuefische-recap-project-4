import {
  getAuctionById,
  getAuctionOffers,
} from "@/lib/services/auctionsService";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auction = await getAuctionById(id);

  if (!auction) notFound();

  const offers = await getAuctionOffers(id);

  return (
    <div className="p-4 grid gap-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{auction.title}</CardTitle>
          <CardDescription>Sold by {auction.seller}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p>Status: {auction.status}</p>
          <p>Description: {auction.description}</p>
          <p>Current Price: {auction.currentPrice}</p>
          <p>Starting Price: {auction.startingPrice}</p>
          <p>End Date: {auction.endDate.toString()}</p>
          <p>Created At: {auction.createdAt.toString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>{offers.length} bid(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length > 0 ? (
            <ul className="grid gap-3">
              {offers.map((offer) => (
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
