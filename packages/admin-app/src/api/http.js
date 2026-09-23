const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const getToken = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("admin_token");
  }
  return null;
};

const setToken = (token) => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("admin_token", token);
  }
};

const removeToken = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("admin_token");
  }
};

export async function http(
  path,
  { method = "GET", body, headers, signal } = {},
) {
  const fullUrl = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = getToken();

  const init = {
    method,
    credentials: "include",
    headers: {
      "ngrok-skip-browser-warning": "true",
      "User-Agent": "SemadakiGozlerApp/1.0",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body &&
        !(body instanceof FormData) && { "Content-Type": "application/json" }),
      ...headers,
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
  };

  try {
    const res = await fetch(fullUrl, init);
    const ct = res.headers.get("content-type") || "";
    const isJSON = ct.includes("application/json");

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

      try {
        if (isJSON) {
          const data = await res.json();
          errorMessage = data.message || data.error || errorMessage;
        } else {
          const text = await res.text();
          console.error(
            `[HTTP] Non-JSON error response:`,
            text.substring(0, 300),
          );

          if (text.includes("ngrok") && text.includes("Visit Site")) {
            errorMessage =
              "ngrok browser warning page returned. This indicates CORS or tunnel issues.";
          } else if (text.includes("CORS")) {
            errorMessage = `CORS error: ${text.substring(0, 200)}`;
          } else {
            errorMessage = text || errorMessage;
          }
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }

      if (res.status === 401) {
        // removeToken();
        console.log("[HTTP] Token removed due to 401 response");
        if (
          typeof window !== "undefined" &&
          window.location &&
          !window.location.pathname.includes("login")
        ) {
          window.location.replace("/login");
        }
        console.log(window.location);
      }

      const err = new Error(errorMessage);
      err.status = res.status;
      err.response = res;
      throw err;
    }

    let data;
    try {
      if (isJSON) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error(
            "Received HTML instead of JSON:",
            text.substring(0, 200),
          );
          throw new Error(
            "Server returned HTML page instead of JSON. This might be an ngrok browser warning or CORS issue.",
          );
        }

        try {
          data = JSON.parse(text);
        } catch {
          data = text;
          console.warn("Expected JSON but got text:", text.substring(0, 100));
        }
      }
    } catch (parseError) {
      throw new Error("Failed to parse server response.");
    }

    if (data && typeof data === "object") {
      if (data.hasOwnProperty("success") && data.hasOwnProperty("data")) {
        if (!data.success) {
          const errorMessage = data.message || "Request failed";
          const err = new Error(errorMessage);
          err.status = res.status;
          err.details = data;
          throw err;
        }

        const responseData = data.data;

        if (path.includes("/login") && responseData && responseData.token) {
          setToken(responseData.token);
          return {
            ok: true,
            token: responseData.token,
            admin: responseData.admin,
            ...responseData,
          };
        }

        return responseData;
      } else {
        if (data && data.token && path.includes("/login")) {
          setToken(data.token);
        }
      }
    }

    // Handle logout
    if (path.includes("/logout")) {
      removeToken();
    }

    return data;
  } catch (fetchError) {
    if (
      fetchError.name === "TypeError" &&
      fetchError.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network error: Could not connect to server. Check if the server is running and CORS is properly configured.",
      );
    }

    throw fetchError;
  }
}

export const get = (p, o) => http(p, o);
export const post = (p, b, o) =>
  http(p, { method: "POST", body: b, ...(o || {}) });
export const del = (p, o) => http(p, { method: "DELETE", ...(o || {}) });
export const put = (p, b, o) =>
  http(p, { method: "PUT", body: b, ...(o || {}) });
export const patch = (p, b, o) =>
  http(p, { method: "PATCH", body: b, ...(o || {}) });

export { getToken, setToken, removeToken };
