import { apiClient } from "./apiClient";

describe("apiClient login error handling", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("does not clear auth state for invalid login credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: (name) => (name === "content-type" ? "application/json" : null),
      },
      json: async () => ({ success: false, message: "Giriş məlumatları yanlışdır" }),
    });

    localStorage.setItem("auth_token", "stale-token");

    await expect(
      apiClient.request("/api/users/login", { method: "POST" })
    ).rejects.toThrow("Giriş məlumatları yanlışdır");

    expect(localStorage.getItem("auth_token")).toBe("stale-token");
  });
});
