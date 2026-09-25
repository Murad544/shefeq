import { ReceiptLong as LogIcon } from "@mui/icons-material";
import {
  Box,
  Stack,
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
import { C, FONT } from "../../config/tokens";

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
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
        <LogIcon sx={{ fontSize: 20, color: C.olive }} />
        <Typography variant="subtitle2" component="h4">
          Uçuş jurnalı · Son Sessiyalar
        </Typography>
        <Box sx={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.textMuted }}>
          ({sessions.length} ümumi)
        </Box>
      </Stack>
      <TableContainer sx={{ border: `1px solid ${C.rule}`, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell>Tarix</TableCell>
              <TableCell>Giriş</TableCell>
              <TableCell>Çıxış vaxtı</TableCell>
              <TableCell>Müddət</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSessions.map((session, index) => (
              <TableRow
                key={session.id}
                hover
                sx={{
                  bgcolor: index % 2 === 0 ? C.paperRaised : "#F6F3EA",
                  animation: `sg-fade-in .35s ease ${Math.min(index, 12) * 35}ms backwards`,
                }}
              >
                <TableCell sx={{ fontSize: "0.875rem" }}>{session.date}</TableCell>
                <TableCell sx={{ fontFamily: FONT.mono, fontSize: "0.85rem" }}>
                  {session.login}
                </TableCell>
                <TableCell sx={{ fontFamily: FONT.mono, fontSize: "0.85rem" }}>
                  {session.logout}
                </TableCell>
                <TableCell sx={{ fontFamily: FONT.mono, fontSize: "0.85rem", fontWeight: 600, color: C.olive }}>
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
          sx={{ borderTop: `1px solid ${C.rule}`, bgcolor: C.paperSunk }}
        />
      </TableContainer>
    </Box>
  );
};

export default GameSessionsTable;
