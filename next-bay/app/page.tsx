import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { isAuthenticated, logout } from "@/app/action";

export default async function Home() {
  const isAuth = await isAuthenticated();
  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <h1 className="text-4xl font-bold">Welcome to DarkBay!</h1>
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
        {isAuth ? (
          <form action={logout}>
            <Button type="submit" variant="outline" size="lg">
              Logout
            </Button>
          </form>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
