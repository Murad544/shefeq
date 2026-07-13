import * as React from "react";
import { adminApi } from "../../api/adminApi";
import { authApi } from "../../api/authApi";

export function useCurrentAdmin() {
  const [state, setState] = React.useState({
    data: [],
    loading: true,
    error: "",
  });

  const refetch = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const res = await authApi.me();
      setState({
        data: res,
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
