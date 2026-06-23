import { fetchAPI } from "./fetchAPI";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type UserResponse = {
  id: string;
  username: string;
  createdAt: Date;
};

export type AuthResponse = {
  accessToken: string;
};

export async function registerAction(
  username: string,
  password: string,
): Promise<ActionResult<UserResponse>> {
  const response = await fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 409) {
    return { success: false, error: "Username is already taken" };
  }

  if (!response.ok) {
    throw new Error(`Failed to register: ${response.statusText}`);
  }

  const user = (await response.json()) as UserResponse;
  return { success: true, data: user };
}

export async function loginAction(
  username: string,
  password: string,
): Promise<ActionResult<AuthResponse>> {
  const response = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 401) {
    return { success: false, error: "Invalid username or password" };
  }

  if (!response.ok) {
    throw new Error(`Failed to login: ${response.statusText}`);
  }

  const json = await response.json();
  const authResponse: AuthResponse = { accessToken: json.access_token };
  return { success: true, data: authResponse };
}

// TODO
export async function logoutAction() {}
