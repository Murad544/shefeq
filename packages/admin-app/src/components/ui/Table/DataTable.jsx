import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { useDragScroll } from "../../../hooks/ui/useDragScroll";
import { createScrollContainerStyles } from "../../../styles/commonStyles";
import TableHeader from "./TableHeader";
import LoadingState from "../Feedback/LoadingState";
import EmptyState from "../Feedback/EmptyState";
import ErrorAlert from "../Feedback/ErrorAlert";

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
            <Grid item xs={12} key={item.id || index}>
              {renderMobileCard ? renderMobileCard(item, index) : null}
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Box
        sx={{
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "30px",
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1))",
            pointerEvents: "none",
            zIndex: 1,
            opacity: 0.7,
          },
          "&::before": {
            content: '"← Drag to scroll →"',
            position: "absolute",
            top: "10px",
            right: "40px",
            fontSize: "0.75rem",
            color: "text.secondary",
            opacity: 0.6,
            zIndex: 2,
            pointerEvents: "none",
            fontWeight: 500,
          },
        }}
      >
        <TableContainer ref={dragScrollRef} sx={createScrollContainerStyles()}>
          <Table stickyHeader size="small" sx={{ minWidth }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      minWidth: column.minWidth || 120,
                      fontWeight: 700,
                      color: `${colorScheme}.main`,
                      bgcolor: "grey.50",
                      borderBottom: "2px solid",
                      borderColor: `${colorScheme}.light`,
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
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
            <TableBody>
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
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(54, 79, 107, 0.08)",
        border: "1px solid",
        borderColor: "grey.200",
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

      <Container maxWidth={false} sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
        <ErrorAlert error={error} />

        <Box
          sx={{
            maxHeight: {
              xs: "calc(100vh - 350px)",
              sm: "calc(100vh - 400px)",
              md: 600,
            },
            overflowY: "auto",
          }}
        >
          {renderTableContent()}
        </Box>
      </Container>
    </Paper>
  );
}
