import * as React from "react";
import { adminApi } from "../../api/adminApi";
import { getToken } from "../../api/http";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export function useAcceptedApplicants(search) {
  const [state, setState] = React.useState({
    data: [],
    loading: true,
    error: "",
  });

  const refetch = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: "" }));

    let isSubscribed = true;

    // Initial fetch
    adminApi
      .listAcceptedApplicants(search)
      .then((res) => {
        if (isSubscribed) {
          setState({
            data: Array.isArray(res?.approvedApplications)
              ? res.approvedApplications
              : [],
            loading: false,
            error: "",
          });
        }
      })
      .catch((e) => {
        if (isSubscribed) {
          setState({
            data: [],
            loading: false,
            error: e.message || "Xəta baş verdi",
          });
        }
      });

    // Establish Real-Time SSE connection
    const token = getToken();
    const sseUrl = `${API_BASE_URL}/api/admin/approved-applications?stream=true${
      token ? `&token=${encodeURIComponent(token)}` : ""
    }${search ? `&search=${encodeURIComponent(search)}` : ""}`;

    let eventSource;
    try {
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onmessage = (event) => {
        if (!isSubscribed) return;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && Array.isArray(parsed.approvedApplications)) {
            setState({
              data: parsed.approvedApplications,
              loading: false,
              error: "",
            });
          }
        } catch (err) {
          console.error("Error parsing SSE message:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.warn("SSE connection warning/error:", err);
      };
    } catch (sseErr) {
      console.error("Failed to establish SSE connection:", sseErr);
    }

    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [search]);

  React.useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { ...state, refetch };
}
