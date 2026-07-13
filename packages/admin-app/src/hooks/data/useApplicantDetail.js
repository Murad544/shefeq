import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useApplicantDetail(id) {
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: "",
  });

  const refetch = React.useCallback(async () => {
    if (!id) return;

    setState({ data: null, loading: true, error: "" });
    try {
      const data = await adminApi.getApplicantFull(id);
      setState({ data, loading: false, error: "" });
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e.message || "Xəta baş verdi",
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (!id) return;

    let alive = true;
    const fetchData = async () => {
      setState({ data: null, loading: true, error: "" });
      try {
        const data = await adminApi.getApplicantFull(id);
        if (alive) setState({ data, loading: false, error: "" });
      } catch (e) {
        if (alive) {
          setState({
            data: null,
            loading: false,
            error: e.message || "Xəta baş verdi",
          });
        }
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [id]);

  return { ...state, refetch };
}
