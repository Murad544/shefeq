import { Box, Button, Container, TableCell, TableRow } from "@mui/material";
import React from "react";
import { MdPersonAdd } from "react-icons/md";
import { C, FONT } from "../../../styles/tokens";
import { useAdmins } from "../../../hooks/data/useAdmins";
import { useCurrentAdmin } from "../../../hooks/data/useCurrentAdmin";
import { useTableConfig } from "../../../hooks/utils/useTableConfig";
import { createHoverRowStyles } from "../../../styles/commonStyles";
import { formatDate } from "../../../utils/formatters";
import StatusChip from "../../ui/Display/StatusChip";
import DataTable from "../../ui/Table/DataTable";
import AdminActionButtons from "./AdminActionButtons";
import AdminCard from "./AdminCard";
import CreateAdminModal from "./CreateAdminModal";

export default function AdminsView() {
  const { data, loading, error } = useAdmins();

  // get the current admin. only show the "create admin" button if the current admin is a "superadmin"
  const { data: currentAdmin } = useCurrentAdmin();
  const { columns, isMobile } = useTableConfig("admins", "primary");
  const [modalOpen, setModalOpen] = React.useState(false);

  const renderMobileCard = (admin) => <AdminCard admin={admin} />;

  const renderRow = (admin) => (
    <TableRow key={admin.id} sx={createHoverRowStyles("primary")}>
      <TableCell sx={{ fontWeight: 500 }}>{admin.email}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{admin.name || "-"}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{admin.role || "-"}</TableCell>
      <TableCell>
        <StatusChip status={admin.is_active} />
      </TableCell>
      <TableCell sx={{ color: "text.secondary" }}>
        {formatDate(admin.last_login_at, "DD.MM.YYYY HH:mm") || "-"}
      </TableCell>
      <TableCell sx={{ color: "text.secondary" }}>
        {formatDate(admin.created_at, "DD.MM.YYYY HH:mm") || "-"}
      </TableCell>
      <TableCell sx={{ color: "text.secondary" }}>
        <AdminActionButtons admin={admin} />
      </TableCell>
    </TableRow>
  );

  const headerActions = (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        px: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "space-between", md: "flex-end" },
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 1,
          px: 1.5,
          py: 0.5,
          border: `1px solid ${C.lineDarkStrong}`,
          fontFamily: FONT.mono,
        }}
      >
        <Box component="span" sx={{ fontSize: "1.05rem", color: C.brassLight }}>
          {data?.length || 0}
        </Box>
        <Box component="span" sx={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textOnDarkMuted }}>
          ADMİN
        </Box>
      </Box>
      {currentAdmin.role === "superadmin" && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<MdPersonAdd size={16} />}
          onClick={() => setModalOpen(!modalOpen)}
        >
          Admin Yarat
        </Button>
      )}
      <CreateAdminModal
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );

  return (
    <DataTable
      data={data}
      loading={loading}
      error={error}
      columns={columns}
      colorScheme="primary"
      minWidth={800}
      title="Adminlər"
      subtitle="Sistem administratorlarının siyahısı"
      headerActions={headerActions}
      isMobile={isMobile}
      renderMobileCard={renderMobileCard}
      renderRow={renderRow}
      emptyTitle="Heç bir admin tapılmadı"
      emptySubtitle="Sistem administratoru əlavə edin"
      loadingMessage="Adminlər yüklənir..."
    />
  );
}
