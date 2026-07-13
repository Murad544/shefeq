import { get, patch, post } from "./http";

export const adminApi = {
  listApplicants: async (search) => {
    try {
      const response = await get(
        search
          ? `/api/admin/applications?search=${encodeURIComponent(search)}`
          : "/api/admin/applications",
      );

      if (response && response.applications) {
        return response;
      } else if (Array.isArray(response)) {
        return { applications: response };
      } else {
        console.warn("Unexpected response format for listApplicants:");
        return { applications: [] };
      }
    } catch (error) {
      console.error("List applicants error:", error);
      throw error;
    }
  },

  listAcceptedApplicants: async (search) => {
    try {
      const response = await get(
        search
          ? `/api/admin/approved-applications?search=${encodeURIComponent(
              search,
            )}`
          : "/api/admin/approved-applications",
      );

      if (response && response.approvedApplications) {
        return response;
      } else if (Array.isArray(response)) {
        return { approvedApplications: response };
      } else {
        console.warn("Unexpected response format for listAcceptedApplicants:");
        return { approvedApplications: [] };
      }
    } catch (error) {
      console.error("List accepted applicants error:", error);
      throw error;
    }
  },

  acceptUser: async (id) => {
    try {
      const response = await post(`/api/admin/applications/${id}/approve`);
      return response;
    } catch (error) {
      console.error("Accept user error:", error);
      throw error;
    }
  },

  rejectUser: async (id) => {
    try {
      const response = await post(`/api/admin/applications/${id}/reject`);
      return response;
    } catch (error) {
      console.error("Reject user error:", error);
      throw error;
    }
  },

  checkIfAccepted: async (id) => {
    try {
      const response = await get(`/api/admin/applications/${id}/approved`);
      return response;
    } catch (error) {
      console.error("Check if accepted error:", error);
      throw error;
    }
  },

  listAdmins: async () => {
    try {
      const response = await get("/api/admin/admins");

      if (response && response.admins) {
        return response;
      } else if (Array.isArray(response)) {
        return { admins: response };
      } else {
        console.warn("Unexpected response format for listAdmins:");
        return { admins: [] };
      }
    } catch (error) {
      console.error("List admins error:", error);
      throw error;
    }
  },

  activateAdmin: async (adminId) => {
    try {
      const response = await post(`/api/admin/admins/${adminId}/activate`);
      return response;
    } catch (error) {
      console.error("Activate admin error:", error);
      throw error;
    }
  },

  deactivateAdmin: async (adminId) => {
    try {
      const response = await post(`/api/admin/admins/${adminId}/deactivate`);
      return response;
    } catch (error) {
      console.error("Deactivate admin error:", error);
      throw error;
    }
  },

  getApplicantFull: async (id) => {
    try {
      const response = await get(`/api/admin/applications/${id}/full`);
      return response;
    } catch (error) {
      console.error("Get applicant full error:", error);
      throw error;
    }
  },

  getUserEditData: async (id) => {
    try {
      const response = await get(`/api/admin/users/${id}/edit-data`);
      return response;
    } catch (error) {
      console.error("Get user edit data error:", error);
      throw error;
    }
  },

  updateUserData: async (id, body) => {
    try {
      const response = await patch(`/api/admin/users/${id}/edit`, body);
      return response;
    } catch (error) {
      console.error("Update user data error:", error);
      throw error;
    }
  },

  listQuestions: async () => {
    try {
      const response = await get("/api/questions");

      if (Array.isArray(response)) {
        return response;
      } else if (response && response.questions) {
        return response.questions;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn("Unexpected response format for listQuestions:");
        return [];
      }
    } catch (error) {
      console.error("List questions error:", error);
      throw error;
    }
  },

  downloadFile: async (fileId) => {
    try {
      const token = localStorage.getItem("admin_token");
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:4000";

      const response = await fetch(
        `${API_BASE_URL}/api/admin/files/${fileId}/download`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`,
        );
      }

      return response;
    } catch (error) {
      console.error("Download file error:", error);
      throw error;
    }
  },
};
