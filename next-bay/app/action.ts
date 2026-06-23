"use server";

import {
  type AuthResponse,
  registerAction,
  loginAction,
  type ActionResult,
  type UserResponse,
} from "@/lib/authActions";
import { revalidatePath } from "next/cache";

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
  // TODO: Store the access token in a cookie
  revalidatePath("/login");
  return { success: true, data: null };
}
