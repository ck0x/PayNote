import { ApiError, RateLimitError } from "./errors";
import type { ProblemDetail } from "@/types/interfaces/ProblemDetail";

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * HTTP client options
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
}

/**
 * Build URL with query parameters
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // No content responses
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  // Success responses
  if (response.ok) {
    if (isJson) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  // Error responses
  let problemDetail: ProblemDetail;

  if (isJson) {
    problemDetail = await response.json();
  } else {
    problemDetail = {
      type: "about:blank",
      title: response.statusText || "Unknown Error",
      status: response.status,
      detail: await response.text(),
    };
  }

  // Rate limit error
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
    throw new RateLimitError(
      { ...problemDetail, retryAfterSeconds },
      response
    );
  }

  // Other errors
  throw new ApiError(response.status, problemDetail, response);
}

/**
 * Make HTTP request with timeout and error handling
 */
async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, timeout = 30000, ...fetchOptions } = options;

  const url = buildUrl(path, params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError || error instanceof RateLimitError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(408, {
        type: "about:blank",
        title: "Request Timeout",
        status: 408,
        detail: `Request timed out after ${timeout}ms`,
      });
    }

    // Network or unknown errors
    throw new ApiError(0, {
      type: "about:blank",
      title: "Network Error",
      status: 0,
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * HTTP client methods
 */
export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
