/*
Design question: A user can type any id into the URL. Where do you catch the case where that auction does not exist, and what does the user see?

Here, we catch it in the page component (see getAuctionById in lib/services/auctionsService.ts). If the auction is not found, we return null, which causes the page to throw an error. This error is then caught by the error.tsx file, which displays a user-friendly message.
*/

export default function NotFound() {
  return (
    <div>
      <h2>Auction not found.</h2>
      <p>Sorry, we couldn't find the auction you're looking for.</p>
    </div>
  );
}
