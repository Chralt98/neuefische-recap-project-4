# neuefische-recap-project-4

# Recap Project 4 - NextBay

Welcome to NextBay, the storefront for the DarkBay marketplace. In recap project 3 you built DarkBay as a headless API. Now the API gets a face. NextBay is a Next.js application that lets people browse listings, follow a bidding war, sign in, and place their own offers from the browser.

You can point NextBay at your own DarkBay backend or use the provided starter. The starter is the finished version of DarkBay without the bonus features, so every endpoint you need already exists. Your job is the frontend and the layer that talks to the backend.

NextBay keeps a clear division of labor. DarkBay stays the single source of truth for data and business rules; a bid is still rejected on the server if it fails to beat the current price. NextBay reads from and writes to that API. The trick is where those calls happen. Instead of fetching from inside every component in the browser, you funnel all backend communication through a thin service layer that runs on the Next.js server. Your server components call this layer directly and render finished HTML. The browser receives a page, not a waterfall of loading spinners.

Authentication follows the same server-side instinct. When a user logs in, a route handler exchanges their credentials with DarkBay for a JWT and stores that token in an `httpOnly` cookie. Browser JavaScript can never read it. On every protected request, your service layer pulls the token from the cookie and attaches it as an `Authorization` header. Browsing auctions stays public; creating an auction or placing a bid requires that cookie.

The look comes from Tailwind CSS for layout and shadcn/ui for ready-made components like buttons, cards, and form inputs. Where you need form handling or shared state, you may reach for `react-hook-form` and `zustand`, but neither is required. When the app works locally, you deploy it to Vercel and connect it to your DarkBay backend running on Render.

# Recap Project 4 - Challenges

## Prerequisites

Run DarkBay locally first (your own or the starter). The `npm run start:dev` will start the server on port `3030`. Get te starter template here:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-4/darkbay backend
```

## 1 Project Setup and the Service Layer

Your first objective is a running Next.js application that can reach DarkBay through a single, server-side module.

- Scaffold a new project with `create-next-app` using TypeScript and the App Router.
- Store the DarkBay base URL in an environment variable in `.env`, for example `DARKBAY_API_URL=http://localhost:3030`. Read it on the server, never hardcode it in components.
- Create an `auctionsService` module under `lib/` that groups all auction related fetch calls. Give it small typed functions like `getAuctions()` and `getAuctionById(id)` that build the request, call DarkBay, and return parsed data.
- Design question: Why route every backend call through one server-side module instead of calling `fetch` inside each component? Think about where your API URL and, later, your auth token need to live.
- Resource: Next.js Project Structure

## 2 Browsing Auctions

Build the front page: a list of auctions that visitors can filter and page through, with no login required.

- Make the auction list an async server component that fetches through your service layer and renders the results directly.
- Add a `loading.tsx` so the route shows a fallback while data arrives.
- Design question: The filter and page values come from `searchParams` on the server. What do you gain by keeping that state in the URL rather than in client-side `useState`?
- Resource: Next.js Pages and Layouts

## 3 Auction Detail and Bid History

Each auction needs its own page showing the full listing and the offers placed so far.

- Create a dynamic route with a `[id]` folder. Read the segment from the `params` prop and fetch that single auction plus its offers through the service layer.
- Render the item details, the current price, the end date.
- On the list page, link each list item to its detail page with `next/link`.
- Handle a missing auction. If DarkBay returns a `404` for an unknown id, show a not-found page, add an `error.tsx` boundary for unexpected failures.
- Design question: A user can type any id into the URL. Where do you catch the case where that auction does not exist, and what does the user see?
- Resource: Next.js Dynamic Routes

## 4 Styling with Tailwind and shadcn/ui

Turn the working app into something people want to use.

- Set up Tailwind CSS, then initialize shadcn/ui with `npx shadcn@latest init`.
- Add the components you need with `npx shadcn@latest add`, for example `button`, `card`, `input`, and `select`. Build the auction card pages with the components.
- Make the layout responsive and support a dark mode, fitting for an underground marketplace.
- Continue using shadcn to style the upcoming elements.
- Resource: shadcn/ui Installation

## 5 Authentication

Give users a way to sign in so they can place bids, auctions, and manage their account.

- Create a `authActions` file in your `/lib` folder where you create the `loginAction`, `registerAction`, and `logoutAction` functions.
- Build login and register pages including the respective forms. Use a server action on your own Next.js server for the form action.
- In that handler, call DarkBay’s login endpoint, take the returned JWT, and store it in an `httpOnly` cookie using `cookies()` from `next/headers`. Add a logout function that clears the cookie.
- Create a `fetchAPI` function that reads the token from the cookie with `cookies()`. It receives the path as well as the an options object as the arguments and calls `fetch` by passing those values into it. Additionally, it adds the JWT token to the request headers as `Authorization: Bearer ${token}` if the token exists.
- Update your service layer by replacing the plain `fetch` calls with `fetchAPI`.
- Reflect auth state in the UI: show login and register links to guests, and a logout button plus the user’s actions to signed-in users. Create a `isAuthenticated` function to check if a user is logged in (by reading the cookie). Call it on the server and use it to conditionally render the UI.
- Security question: Why store the JWT in an `httpOnly` cookie read on the server, rather than in `localStorage` where client code can reach it?
- Resource: Next.js cookies

## 6 Protected Actions

With a token in place, let signed-in users create auctions and place bids.

- Build a `create-auction` form and a `place-a-bid` form. Submit them with server functions (`"use server"`) wired to the form’s action, so the mutation runs on the server.
- After a successful write, call `revalidatePath` for the affected route so the list or detail page reflects the new state without a manual refresh.
- Surface DarkBay’s rejections. A bid below the current price or on a closed auction comes back as a specific status code; turn that into a clear message instead of a generic error.
- Business rule: DarkBay derives the seller and bidder identity from the verified token. Your forms must not send a seller or bidder field. Where does that identity come from now?
- Resource: Next.js Server Actions and Mutations

## 7 Deployment to Vercel

Ship the app and connect it to your live backend. The full walkthrough lives in `deployment.md`.

- Push your repository to GitHub and import it into Vercel.
- Set your environment variables in the Vercel project, pointing `DARKBAY_API_URL` at your DarkBay backend on Render. If you don’t have a running Render instance, checkout the devops ci/cd session.
- Open the deployed URL and confirm browsing, login, and bidding all work against the live backend.
- Resource: Deploying on Vercel

## Bonus Challenges

Pick one or more once the main build works.

- `searchParams`: Wire DarkBay’s query options to the URL: `?status=open|closed`, `?min-price` and `?max-price`, sorting by end date, and pagination. Read these from the page’s `searchParams` and forward them to the API.
- `react-hook-form` everywhere: Refactor the auction and bid forms to `react-hook-form` with typed values and validation rules, and share field components through `FormProvider`.
- Global state with `zustand`: Move auth state or a watchlist into a `zustand` store so components subscribe only to the slice they use.
- Watchlist: Surface DarkBay’s watchlist feature. Let signed-in users add or remove an auction and view a dedicated watchlist page.
- Open or closed badge: Read the auction’s derived status and show an “open” or “closed” badge on the card and detail page.
- Admin delete: If the logged-in user is an admin, show a delete control on listings and call the protected delete endpoint.
- Optimistic bidding: Show the new highest bid immediately on submit, then reconcile with the server’s response.
- Dark mode toggle: Add a switch that flips the theme and remembers the choice.
- Skeleton loaders: Replace plain loading text with skeleton placeholders shaped like the auction cards.

# Recap Project 4 - Deployment

## Deploying to Vercel

Vercel is built by the team behind Next.js, so it recognizes a Next.js app without extra configuration. If not done already, create an account on Vercel, preferably with a GitHub OAuth connection. Push your repository to GitHub, then in the Vercel dashboard choose “Add New Project” and import that repository. Vercel detects the framework, runs the build, and gives you a live URL. Every later push to your main branch triggers a new deployment automatically, and pull requests get their own preview URLs so you can check changes before they go live.

The one thing Vercel cannot guess is anything secret or environment-specific, like where your backend lives. That comes next.

## Environment variables

Locally these sit in `.env`, which is not committed. Vercel needs its own copy, set under Project Settings, then Environment Variables. Two details matter here:

- `DARKBAY_API_URL` holds your backend’s public address. Without the `NEXT_PUBLIC_` prefix, this value stays on the server, which is exactly what your service layer needs. Browser code never sees it.
- `NEXT_PUBLIC_` prefix exposes a variable to the browser bundle. Use it only for values that are safe to ship to the client, such as a public analytics key. Never give your API URL or any secret this prefix if it should stay server-side.

After adding or changing a variable, redeploy so the new value takes effect. Variables are read at build and run time, not patched into an existing deployment.

## Connecting to the Render backend

Your DarkBay API runs as a web service on Render with its own public URL, something like `https://darkbay.onrender.com`. Set `DARKBAY_API_URL` on Vercel to that address and your service layer will call the live backend instead of `localhost`.

Two quirks are worth planning for:

- Cold starts: Render’s free tier sleeps a service after inactivity. The first request after a nap can take many seconds while the service wakes. Your `loading.tsx` states cover this, but don’t be suprised if the first load takes a while to complete.
- CORS: Calls made from your Next.js server to Render are server-to-server and not subject to browser CORS rules. If you also call DarkBay directly from browser code, configure DarkBay to allow your Vercel domain as an origin. Since we are keeping calls in the server-side service layer we sidestep this issue entirely.

## Resources

- Deploying on Vercel
- Vercel Environment Variables
- Render Web Services
