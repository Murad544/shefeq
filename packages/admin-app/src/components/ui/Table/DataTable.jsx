import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  Grid,
} from "@mui/material";
import { useDragScroll } from "../../../hooks/ui/useDragScroll";
import { createScrollContainerStyles } from "../../../styles/commonStyles";
import { getColorScheme } from "../../../constants/colors";
import { C, FONT, labelCaps } from "../../../styles/tokens";
import TableHeader from "./TableHeader";
import LoadingState from "../Feedback/LoadingState";
import EmptyState from "../Feedback/EmptyState";
import ErrorAlert from "../Feedback/ErrorAlert";

// First rows fade in one after another when the list mounts.
const rowStagger = {
  "& > tr": { animation: "sg-fade-in .4s ease backwards" },
  ...Object.fromEntries(
    Array.from({ length: 16 }, (_, i) => [
      `& > tr:nth-of-type(${i + 1})`,
      { animationDelay: `${i * 35}ms` },
    ])
  ),
};

export default function DataTable({
  // Data props
  data = [],
  loading = false,
  error = null,

  // Table configuration
  columns = [],
  colorScheme = "primary",
  minWidth = 1400,

  // Header props
  title,
  subtitle,
  headerActions,
  headerChildren,

  // Mobile props
  isMobile = false,
  renderMobileCard,

  // Row rendering
  renderRow,
  onRowClick,

  // Empty/Error states
  emptyTitle,
  emptySubtitle,
  loadingMessage,
}) {
  const dragScrollRef = useDragScroll();
  const scheme = getColorScheme(colorScheme);

  const renderTableContent = () => {
    if (loading) {
      return (
        <LoadingState message={loadingMessage} color={`${colorScheme}.main`} />
      );
    }

    if (data.length === 0) {
      return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
    }

    if (isMobile) {
      return (
        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid
              item
              xs={12}
              key={item.id || index}
              sx={{ animation: `sg-fade-up .45s ease ${Math.min(index, 10) * 50}ms backwards` }}
            >
              {renderMobileCard ? renderMobileCard(item, index) : null}
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
            fontFamily: FONT.mono,
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            color: C.textFaint,
          }}
        >
          ⇆ SÜRÜŞDÜRƏRƏK BAXIN
        </Box>
        <TableContainer
          ref={dragScrollRef}
          sx={{ ...createScrollContainerStyles(), border: `1px solid ${C.rule}` }}
        >
          <Table stickyHeader size="small" sx={{ minWidth }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      ...labelCaps,
                      minWidth: column.minWidth || 120,
                      fontSize: { xs: "0.72rem", md: "0.78rem" },
                      color: C.text,
                      bgcolor: C.paperSunk,
                      borderBottom: `2px solid ${scheme.main}`,
                      whiteSpace: "nowrap",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={rowStagger}>
              {data.map((item, index) =>
                renderRow ? renderRow(item, index) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: C.paperRaised,
        border: `1px solid ${C.rule}`,
        overflow: "hidden",
      }}
    >
      <TableHeader
        title={title}
        subtitle={subtitle}
        colorScheme={colorScheme}
        actions={headerActions}
      >
        {headerChildren}
      </TableHeader>

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <ErrorAlert error={error} />

        <Box
          sx={{
            maxHeight: {
              xs: "calc(100vh - 350px)",
              sm: "calc(100vh - 400px)",
              md: 640,
            },
            overflowY: "auto",
          }}
        >
          {renderTableContent()}
        </Box>
      </Box>
    </Box>
  );
}
