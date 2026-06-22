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
): Promise<ActionResult<UserResponse>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await registerAction(username, password);
  revalidatePath("/register");
  return result;
}

export async function login(
  formData: FormData,
): Promise<ActionResult<AuthResponse>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = await loginAction(username, password);
  revalidatePath("/login");
  return result;
}
