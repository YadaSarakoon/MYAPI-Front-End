import { ApiError } from './errors';

export { ApiError } from './errors';

const DEFAULT_TIMEOUT_MS = 15_000;
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// No production fallback: callers must explicitly configure an environment URL.
export const API_BASE_URL = configuredBaseUrl?.replace(/\/+$/, '') ?? '';

export interface ApiRequestOptions extends RequestInit {
  accessToken?: string;
  timeoutMs?: number;
}

export async function request<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const {
    accessToken,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers: requestHeaders,
    signal: callerSignal,
    ...requestOptions
  } = options;
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_BASE_URL is not configured', 0);
  }
  const headers = new Headers(requestHeaders);
  const isFormData =
    typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;

  if (!isFormData && requestOptions.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId = window.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);
  const abortFromCaller = () => controller.abort(callerSignal?.reason);

  if (callerSignal?.aborted) {
    abortFromCaller();
  } else {
    callerSignal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  try {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      signal: controller.signal,
    });

    if (response.status === 204) {
      return undefined as TResponse;
    }

    const contentType = response.headers.get('content-type') ?? '';
    let payload: unknown;

    if (contentType.includes('application/json')) {
      try {
        payload = await response.json();
      } catch {
        throw new ApiError('The API returned invalid JSON', response.status);
      }
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload !== null
          ? 'message' in payload && typeof payload.message === 'string'
            ? payload.message
            : 'error_description' in payload &&
                typeof payload.error_description === 'string'
              ? payload.error_description
              : `Request failed with status ${response.status}`
          : `Request failed with status ${response.status}`;

      throw new ApiError(message, response.status, payload);
    }

    return payload as TResponse;
  } catch (error) {
    if (didTimeout) {
      throw new ApiError('The API request timed out', 408);
    }

    if (callerSignal?.aborted) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError('Unable to reach the API. Check the network or API URL.', 0, error);
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    callerSignal?.removeEventListener('abort', abortFromCaller);
  }
}
