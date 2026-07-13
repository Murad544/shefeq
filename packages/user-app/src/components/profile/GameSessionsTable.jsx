import { Visibility as VisibilityIcon } from "@mui/icons-material";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { useState } from "react";

const GameSessionsTable = ({ sessions }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!sessions || sessions.length === 0) {
    return null;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const paginatedSessions = sessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <VisibilityIcon sx={{ fontSize: 20, mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          Son Sessiyalar ({sessions.length} ümumi)
        </Typography>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderBottom: "2px solid #e0e0e0",
                  py: 1.5,
                }}
              >
                Tarix
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderBottom: "2px solid #e0e0e0",
                  py: 1.5,
                }}
              >
                Giriş
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderBottom: "2px solid #e0e0e0",
                  py: 1.5,
                }}
              >
                Çıxış
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderBottom: "2px solid #e0e0e0",
                  py: 1.5,
                }}
              >
                Müddət
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSessions.map((session, index) => (
              <TableRow
                key={session.id}
                sx={{
                  "&:hover": {
                    bgcolor: "#f9f9f9",
                  },
                  bgcolor: index % 2 === 0 ? "white" : "#fafafa",
                }}
              >
                <TableCell sx={{ py: 1.5, fontSize: "0.875rem" }}>
                  {session.date}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontSize: "0.875rem" }}>
                  {session.login}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontSize: "0.875rem" }}>
                  {session.logout}
                </TableCell>
                <TableCell
                  sx={{ py: 1.5, fontSize: "0.875rem", fontWeight: 500 }}
                >
                  {session.duration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sessions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Səhifə başına:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
};

export default GameSessionsTable;
