import { cookies } from "next/headers";

export async function fetchAPI(
  urlPath: string,
  // Using RequestInit from the Fetch API to allow for flexible request options
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return await fetch(`${process.env.DARKBAY_API_URL}${urlPath}`, {
    ...options,
    headers,
  });
}
