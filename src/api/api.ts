export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "https://api.gatedplus.com"
).replace(/\/$/, "");

let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

export const getAuthToken = () => currentToken;

export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token =
    currentToken ||
    (typeof globalThis !== "undefined" && (globalThis as any).authToken) ||
    (typeof localStorage !== "undefined"
      ? localStorage.getItem("authToken") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("gatedplus_agent_token")
      : null);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export async function request<T = any>(
  endpointOrUrl: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpointOrUrl.startsWith("http")
    ? endpointOrUrl
    : `${API_BASE_URL}${endpointOrUrl.startsWith("/") ? "" : "/"}${endpointOrUrl}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: await response.text() };
    }
    const error: any = new Error(
      errorData?.detail ||
        errorData?.message ||
        `Request failed with status: ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
