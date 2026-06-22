import {
  getAuctionById,
  getAuctionOffers,
} from "@/lib/services/auctionsService";

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auction = await getAuctionById(id);
  const offers = await getAuctionOffers(id);

  return (
    <div>
      {auction ? (
        <div>
          <h1>Auction: {auction.title}</h1>
          <p>ID: {auction.id}</p>
          <p>Status: {auction.status}</p>
          <p>Description: {auction.description}</p>
          <p>End Date: {auction.endDate.toString()}</p>
          <p>Starting Price: {auction.startingPrice}</p>
          <p>Current Price: {auction.currentPrice}</p>
          <p>Seller: {auction.seller}</p>
          <p>Created At: {auction.createdAt.toString()}</p>
          <h2>Offers:</h2>
          {offers.length > 0 ? (
            <ul>
              {offers.map((offer) => (
                <li key={offer.id}>
                  <h5>Offer ID: {offer.id}</h5>
                  <p>Bidder: {offer.bidder}</p>
                  <p>Amount: {offer.amount}</p>
                  <p>Created At: {offer.createdAt.toString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No offers yet.</p>
          )}
        </div>
      ) : (
        <div>
          <h1>Auction not found</h1>
        </div>
      )}
    </div>
  );
}
