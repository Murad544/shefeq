import { API_ENDPOINTS } from "../../config/constants";

const API_URL = process.env.REACT_APP_API_URL;

// ---------------------------------------------------------------------------
// Auth redirect helpers
// ---------------------------------------------------------------------------

/**
 * Endpoints that are allowed without a token.
 * Requests to these routes will NOT trigger the no-token redirect.
 */
const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.REGISTER,
  API_ENDPOINTS.QUESTIONS,
  "/api/users/login",
  "/api/activate/",
];

/** Clear token and hard-navigate to home page. */
function redirectToHome() {
  try {
    localStorage.removeItem("auth_token");
  } catch (_) {}
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
}

/** If user already has a token and is on /login, send them to /profile. */
function redirectIfAuthenticated() {
  try {
    const token = localStorage.getItem("auth_token");
    if (token && window.location.pathname === "/login") {
      window.location.replace("/profile");
    }
  } catch (_) {}
}

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "ngrok-skip-browser-warning": "true",
    };
  }

  async request(endpoint, options = {}) {
    // Guard: redirect already-authenticated users away from /login
    redirectIfAuthenticated();

    // Guard: require token for protected endpoints
    const isPublic = PUBLIC_ENDPOINTS.some((pub) => endpoint.startsWith(pub));
    if (!isPublic) {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          redirectToHome();
          // Return a never-resolving promise so callers don't process a null response
          return new Promise(() => {});
        }
      } catch (_) {
        redirectToHome();
        return new Promise(() => {});
      }
    }
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Attach auth token if present
    try {
      const token = localStorage.getItem("auth_token");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      // ignore in non-browser environments
    }

    // Don't set Content-Type for FormData, let browser set it with boundary
    if (options.body && !(options.body instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type");
      const isJSON = contentType && contentType.includes("application/json");

      let responseData;
      if (isJSON) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          responseData,
          isJSON,
          endpoint,
        );
      }

      if (isJSON && responseData && typeof responseData === "object") {
        if (
          responseData.hasOwnProperty("success") &&
          responseData.hasOwnProperty("data")
        ) {
          if (responseData.success) {
            return responseData.data;
          } else {
            throw new Error(responseData.message || "Request failed");
          }
        }
      }

      return responseData;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async handleErrorResponse(response, responseData, isJSON, endpoint = "") {
    let errorMessage;

    if (isJSON && responseData && typeof responseData === "object") {
      if (responseData.success === false) {
        errorMessage =
          responseData.message ||
          `HTTP ${response.status}: ${response.statusText}`;

        // Handle validation errors (support `errors` or `details` from backend)
        const validationPayload = responseData.errors || responseData.details;
        if (validationPayload) {
          const validationError = new Error(errorMessage);
          validationError.validationErrors = validationPayload;
          validationError.status = response.status;
          throw validationError;
        }
      } else {
        errorMessage =
          responseData.message ||
          responseData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
      }
    } else {
      errorMessage =
        responseData || `HTTP ${response.status}: ${response.statusText}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;

    // 401 Unauthorized — only redirect for protected routes.
    // Public endpoints like login should stay on the current page and show the error.
    const isPublic = PUBLIC_ENDPOINTS.some((pub) => endpoint.startsWith(pub));
    if (response.status === 401 && !isPublic) {
      redirectToHome();
    }

    throw error;
  }

  // Convenience methods using API_ENDPOINTS
  async getQuestions() {
    return this.get(API_ENDPOINTS.QUESTIONS);
  }

  async registerUser(formData) {
    return this.post(API_ENDPOINTS.REGISTER, formData);
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_URL);
