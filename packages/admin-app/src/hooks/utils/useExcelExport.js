import { useState, useCallback } from "react";
import { exportAcceptedApplicantsToExcel } from "../../utils/excelExport";

export function useExcelExport() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportAcceptedApplicants = useCallback(async (data, filename) => {
    if (!data || data.length === 0) {
      setError("No data to export");
      return false;
    }

    setExporting(true);
    setError(null);

    try {
      const defaultFilename = `qebul-edilenler-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      const result = await exportAcceptedApplicantsToExcel(
        data,
        filename || defaultFilename
      );
      return result;
    } catch (err) {
      console.error("Export error:", err);
      setError(err.message || "Export failed");
      return false;
    } finally {
      setExporting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    exporting,
    error,
    exportAcceptedApplicants,
    clearError,
  };
}
