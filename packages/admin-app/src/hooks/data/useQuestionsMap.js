import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useQuestionsMap() {
  const [map, setMap] = React.useState(new Map());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await adminApi.listQuestions();
      const items = Array.isArray(res?.questions)
        ? res.questions
        : Array.isArray(res)
        ? res
        : [];

      const questionMap = new Map();
      for (const q of items) {
        const id = q.id ?? q.question_id ?? q.qid;
        const text = q.text ?? q.title ?? q.question ?? "";
        if (id != null) {
          questionMap.set(Number(id), String(text));
        }
      }

      setMap(questionMap);
    } catch (err) {
      setError(err.message || "Suallar yüklənərkən xəta baş verdi");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let alive = true;

    const loadQuestions = async () => {
      try {
        await fetchQuestions();
      } catch (err) {
        if (alive) {
          console.error("Failed to load questions:", err);
        }
      }
    };

    loadQuestions();

    return () => {
      alive = false;
    };
  }, [fetchQuestions]);

  return {
    map,
    loading,
    error,
    refetch: fetchQuestions,
  };
}
