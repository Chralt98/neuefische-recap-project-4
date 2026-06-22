import { getAuctions } from "@/lib/services/auctionsService";

export default async function AuctionList() {
  const filter = {}; // You can customize the filter as needed
  const auctions = await getAuctions(filter);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {auctions.map((auction) => (
          <div key={auction.id} className="border p-4 rounded-md">
            <h1>Auction: {auction.title}</h1>
            <p>ID: {auction.id}</p>
            <p>Status: {auction.status}</p>
            <p>Description: {auction.description}</p>
            <p>End Date: {auction.endDate.toString()}</p>
            <p>Starting Price: {auction.startingPrice}</p>
            <p>Current Price: {auction.currentPrice}</p>
            <p>Seller: {auction.seller}</p>
            <p>Created At: {auction.createdAt.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
