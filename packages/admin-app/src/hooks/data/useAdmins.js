import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useAdmins() {
  const [state, setState] = React.useState({
    data: [],
    loading: true,
    error: "",
  });

  const refetch = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const res = await adminApi.listAdmins();
      setState({
        data: Array.isArray(res?.admins) ? res.admins : [],
        loading: false,
        error: "",
      });
    } catch (e) {
      setState({
        data: [],
        loading: false,
        error: e.message || "Xəta baş verdi",
      });
    }
  }, []);

  React.useEffect(() => {
    const ctrl = new AbortController();
    refetch();
    return () => ctrl.abort();
  }, [refetch]);

  return { ...state, refetch };
}
