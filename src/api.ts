import type { AuthTokens, Forecast, HourlyAnalysis } from "./types";

const baseUrl = (
  import.meta.env.VITE_GATEWAY_URL ?? "https://weather-gateway.onrender.com"
).replace(/\/$/, "");
export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      data?.detail ?? data?.message ?? "Request failed",
      response.status,
    );
  }
  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthTokens>("/gateway/authentication/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
  }) =>
    request("/gateway/users", { method: "POST", body: JSON.stringify(data) }),
  forecast: (token: string, data: { name: string; country_code: string }) =>
    request<Forecast>(
      "/gateway/search-city",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
          count: 1,
          language: "en",
          format: "json",
          forecast_days: 1,
        }),
      },
      token,
    ),
  analysis: (
    token: string,
    data: { city: string; country_code: string; day?: string; filter?: string },
  ) => {
    const params = new URLSearchParams({
      city: data.city,
      country_code: data.country_code,
    });
    if (data.day) params.set("day", data.day);
    if (data.filter) params.set("filter", data.filter);
    return request<HourlyAnalysis>(
      `/gateway/get-forecast-hourly-analysis?${params}`,
      {},
      token,
    );
  },
};
