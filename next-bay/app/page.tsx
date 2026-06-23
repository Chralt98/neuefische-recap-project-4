import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <h1 className="text-4xl font-bold">Welcome to DarkBay</h1>
      <p className="text-muted-foreground text-lg">
        The underground auction marketplace
      </p>
      <div className="flex gap-4">
        <Link
          href="/auction-list"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Browse Auctions
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
