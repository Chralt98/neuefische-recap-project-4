"use server";

import {
  registerAction,
  loginAction,
  type ActionResult,
} from "@/lib/authActions";
import {
  Auction,
  createAuction as createAuctionService,
} from "@/lib/services/auctionsService";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(
  formData: FormData,
): Promise<ActionResult<null>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await registerAction(username, password);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  revalidatePath("/register");
  return { success: true, data: null };
}

/*
Security question: Why store the JWT in an httpOnly cookie read on the server, rather than in localStorage where client code can reach it?

An httpOnly cookie is not accessible via JavaScript, which helps protect against XSS attacks. 
Storing the JWT in localStorage would make it accessible to any script running on the page, increasing the risk of token theft.
By using an httpOnly cookie, we ensure that the token is only sent with HTTP requests and cannot be accessed or manipulated by client-side scripts.
*/

export async function login(formData: FormData): Promise<ActionResult<null>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await loginAction(username, password);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  const cookieStore = await cookies();
  cookieStore.set("accessToken", result.data.accessToken, {
    httpOnly: true,
    path: "/",
  });
  revalidatePath("/login");
  return { success: true, data: null };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "accessToken", path: "/" });
  revalidatePath("/");
  redirect("/");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken !== undefined;
}

export async function createAuction(formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startingPrice = parseFloat(formData.get("startingPrice") as string);
  const endDateString = formData.get("endDate") as string | null;
  const endDate = endDateString ? new Date(endDateString) : undefined;

  const result = await createAuctionService({
    title,
    description,
    startingPrice,
    endDate,
  });
  if (!result) {
    throw new Error("Failed to create auction");
  }
  revalidatePath("/auction-list");
}
