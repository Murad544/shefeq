import * as React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { MdSportsEsports, MdAccessTime } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";

export default function GameAccountInfo({ loading, gameAccount }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const sessions = gameAccount?.sessions || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <InfoCard title="Oyun Hesabı" icon={<MdSportsEsports size={20} />}>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
          <Skeleton
            variant="rectangular"
            height={150}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ) : (
        <Box>
          {/* Total Play Time */}
          <Box
            sx={{
              bgcolor: "grey.50",
              borderRadius: 0,
              p: 2,
              mb: 3,
              border: "1px solid",
              borderColor: "grey.200",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <MdAccessTime size={20} style={{ color: "#ff9800" }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Ümumi Oynama Vaxtı
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {gameAccount?.totalPlayTime || "0 saat 0 dəq"}
              </Typography>
            </Box>
          </Box>

          {/* Son Sessiyalar */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Son Sessiyalar
          </Typography>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 0, mb: 1 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}
                  >
                    Tarix
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}
                  >
                    Giriş
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}
                  >
                    Çıxış
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}
                  >
                    Müddət
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((session) => (
                    <TableRow
                      key={session.id}
                      sx={{ "&:hover": { bgcolor: "grey.50" } }}
                    >
                      <TableCell sx={{ py: 1, fontSize: "0.8rem" }}>
                        {session.date}
                      </TableCell>
                      <TableCell sx={{ py: 1, fontSize: "0.8rem" }}>
                        {session.login}
                      </TableCell>
                      <TableCell sx={{ py: 1, fontSize: "0.8rem" }}>
                        {session.logout}
                      </TableCell>
                      <TableCell
                        sx={{ py: 1, fontSize: "0.8rem", fontWeight: 500 }}
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
              rowsPerPageOptions={[5, 10]}
              labelRowsPerPage="Sətir:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} / ${count}`
              }
            />
          </TableContainer>
        </Box>
      )}
    </InfoCard>
  );
}
