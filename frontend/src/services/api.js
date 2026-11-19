/**
 * Production-Ready Resilient API Client
 * - Exponential backoff & retry mechanism
 * - AbortController timeout handling (Slow internet resilience)
 * - Automatic Idempotency-Key injection (Double-click prevention)
 * - HttpOnly cookie credentials
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 8000;
const MAX_RETRIES = Number(import.meta.env.VITE_API_MAX_RETRIES) || 2;

// Utility to generate unique UUID-like idempotency keys
export const generateIdempotencyKey = () => {
  return 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Sleep helper for backoff
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeout = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    useIdempotency = true,
    ...customConfig
  } = options;

  const url = `${BASE_URL}${endpoint}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add idempotency key for state modifying requests
  if (useIdempotency && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    if (!requestHeaders['Idempotency-Key'] && !requestHeaders['idempotency-key']) {
      requestHeaders['Idempotency-Key'] = generateIdempotencyKey();
    }
  }

  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : null,
        signal: controller.signal,
        credentials: 'include', // Send and receive HttpOnly cookies
        ...customConfig
      });

      clearTimeout(timeoutId);

      // Parse JSON payload safely
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        const errorMsg = data?.message || `HTTP error ${response.status}: ${response.statusText}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;

        // Do not retry 4xx client errors (e.g. 400 Bad Request, 401 Unauthorized, 422 Validation)
        if (response.status >= 400 && response.status < 500) {
          throw err;
        }

        // 5xx Server errors can be retried
        throw err;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      // Handle AbortController Timeout
      if (err.name === 'AbortError') {
        lastError = new Error(`Request timed out after ${timeout}ms. Please check your connection.`);
        lastError.isTimeout = true;
      }

      attempt++;

      // If we still have retries and it's a network error or timeout or 5xx, wait and backoff
      if (attempt <= retries && (!err.status || err.status >= 500 || err.isTimeout)) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 200, 6000);
        console.warn(`[Network Retry] Attempt ${attempt}/${retries} failed for ${endpoint}. Retrying in ${Math.round(backoffMs)}ms...`);
        await sleep(backoffMs);
      } else {
        break;
      }
    }
  }

  throw lastError;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options })
};
