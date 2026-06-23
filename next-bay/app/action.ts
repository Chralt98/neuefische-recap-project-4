"use server";

import {
  registerAction,
  loginAction,
  type ActionResult,
} from "@/lib/authActions";
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
