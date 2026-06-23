"use server";

import {
  registerAction,
  loginAction,
  type ActionResult,
} from "@/lib/authActions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  cookieStore.set("accessToken", result.data.accessToken, { httpOnly: true });
  revalidatePath("/login");
  return { success: true, data: null };
}

export async function logout(): Promise<ActionResult<null>> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  revalidatePath("/login");
  return { success: true, data: null };
}
