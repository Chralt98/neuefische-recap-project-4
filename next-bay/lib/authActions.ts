type ActionResult<T> =
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
  const response = await fetch(`${process.env.DARKBAY_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

// TODO: export async function loginAction(): Promise<AuthResponse> {}

// TODO: export async function logoutAction() {}
