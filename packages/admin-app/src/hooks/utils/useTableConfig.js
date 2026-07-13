import { useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { getTableColumns } from "../../constants/tableColumns";
import {
  createHoverRowStyles,
  createTableHeaderStyles,
} from "../../styles/commonStyles";

export const useTableConfig = (type, colorScheme = "primary") => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const columns = useMemo(() => getTableColumns(type), [type]);

  const rowStyles = useMemo(
    () => createHoverRowStyles(colorScheme),
    [colorScheme]
  );

  const headerStyles = useMemo(
    () => createTableHeaderStyles(colorScheme),
    [colorScheme]
  );

  const responsiveConfig = useMemo(
    () => ({
      isMobile,
      isTablet,
      searchPlaceholder: isMobile
        ? "Axtar..."
        : "Axtar: ad, soyad, e-poçt, telefon...",
      pageSize: isMobile ? 10 : isTablet ? 15 : 20,
    }),
    [isMobile, isTablet]
  );

  return {
    columns,
    rowStyles,
    headerStyles,
    ...responsiveConfig,
  };
};
