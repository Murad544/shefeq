import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useSingleAdmin(adminId) {
  const [state, setState] = React.useState({
    data: null,
    loading: true,
    error: "",
  });

  const fetchAdmin = React.useCallback(async () => {
    if (!adminId) return;

    setState({ data: null, loading: true, error: "" });

    try {
      const res = await adminApi.getSingleAdmin(adminId);
      setState({
        data: res?.admin || res || null,
        loading: false,
        error: "",
      });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e.message || "Xəta baş verdi",
      });
    }
  }, [adminId]);

  React.useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  return { ...state, refetch: fetchAdmin };
}
