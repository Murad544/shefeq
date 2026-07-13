import { post, get } from "./http";

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await post("/api/admin/auth/login", { email, password });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  me: async () => {
    try {
      const response = await get("/api/admin/auth/me");
      return response.admin || response;
    } catch (error) {
      console.error("Me error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await post("/api/admin/auth/logout");
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      return { success: true };
    }
  },

  createAdmin: async (body) => {
    try {
      const response = await post("/api/admin/auth/bootstrap", body);

      return response;
    } catch (error) {
      console.error("Create admin error:", error);
      return { success: false, error };
    }
  },
};
