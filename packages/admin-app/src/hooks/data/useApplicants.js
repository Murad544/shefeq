import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useApplicants(search) {
  const [state, setState] = React.useState({
    data: [],
    loading: true,
    error: "",
  });

  const refetch = React.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    const ctrl = new AbortController();

    const t = setTimeout(async () => {
      try {
        const res = await adminApi.listApplicants(search);
        setState({
          data: Array.isArray(res?.applications) ? res.applications : [],
          loading: false,
          error: "",
        });
      } catch (e) {
        if (e.name !== "AbortError") {
          setState({
            data: [],
            loading: false,
            error: e.message || "Xəta baş verdi",
          });
        }
      }
    }, 350);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [search]);

  React.useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { ...state, refetch };
}
