import { Button, Chip, Container, TableCell, TableRow } from "@mui/material";
import React from "react";
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
        px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 0 },
        py: { xs: 2, sm: 3, md: 4, lg: 0 },
        maxWidth: { xl: "2500px" },
        mx: "auto",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Chip
        label={`${data?.length || 0} admin`}
        size="small"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.2)",
          color: "white",
          fontWeight: 600,
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      />
      {currentAdmin.role === "superadmin" && (
        <Button
          onClick={() => setModalOpen(!modalOpen)}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "0 10px",
          }}
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
