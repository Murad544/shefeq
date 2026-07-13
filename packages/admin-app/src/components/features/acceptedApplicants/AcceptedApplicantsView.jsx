import React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { MdOpenInNew, MdEdit } from "react-icons/md";
import DataTable from "../../ui/Table/DataTable";
import TableSearch from "../../ui/Table/TableSearch";
import ExportButton from "../../ui/Buttons/ExportButton";
import AcceptedApplicantCard from "./AcceptedApplicantCard";
import ApplicantDrawer from "../applicants/ApplicantDetails/ApplicantDrawer";
import SecretKeyCell from "../../ui/Display/SecretKeyCell";
import { useAcceptedApplicants } from "../../../hooks/data/useAcceptedApplicants";
import { useCurrentAdmin } from "../../../hooks/data/useCurrentAdmin";
import { useTableConfig } from "../../../hooks/utils/useTableConfig";
import {
  readField,
  formatDate,
  formatEducationLevel,
  formatProfession,
} from "../../../utils/formatters";
import { exportAcceptedApplicantsToExcel } from "../../../utils/excelExport";
import {
  createHoverRowStyles,
  createActionButtonStyles,
} from "../../../styles/commonStyles";
import { useNavigate } from "react-router-dom";

export default function AcceptedApplicantsView() {
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedApplicant, setSelectedApplicant] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useAcceptedApplicants(searchValue);
  const { data: currentAdmin } = useCurrentAdmin();
  const { columns, isMobile, searchPlaceholder } = useTableConfig(
    "accepted",
    "success",
  );

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedApplicant(null);
  };

  const handleActionComplete = (action, user) => {
    if (refetch) {
      refetch();
    }
  };

  const handleExportToExcel = async () => {
    if (data.length === 0) {
      return;
    }

    setExporting(true);
    try {
      const filename = `qebul-edilenler-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      await exportAcceptedApplicantsToExcel(data, filename);
    } catch (error) {
      console.error("Export error:", error);
      // You could show a toast/snackbar notification here
    } finally {
      setExporting(false);
    }
  };

  const renderMobileCard = (user) => (
    <AcceptedApplicantCard user={user} onViewDetails={handleViewDetails} />
  );

  const renderRow = (user) => {
    const acceptanceId = readField(user, "acceptance_id");
    const userId = readField(user, "user_id");
    const name = readField(user, "name");
    const surname = readField(user, "surname");
    const fatherName = readField(user, "father_name");
    const dob = formatDate(readField(user, "date_of_birth"));
    const sex = readField(user, "sex");
    const pob = readField(user, "place_of_birth");
    const serial = readField(user, "national_serial_num");
    const natId = readField(user, "national_id_num");
    const phone = readField(user, "phone_number");
    const email = readField(user, "email");
    const edu = formatEducationLevel(readField(user, "education_level"));
    const uni = readField(user, "university");
    const profession = formatProfession(readField(user, "profession"));
    const secret = readField(user, "secret_key");
    const acceptedAt = formatDate(readField(user, "accepted_at"));

    const totalSeconds = user?.total_duration_seconds || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return (
      <TableRow
        key={acceptanceId || `${email}-${serial}-${natId}`}
        sx={createHoverRowStyles("success")}
      >
        <TableCell>
          {userId ? (
            <Chip
              label="Aktiv"
              color="success"
              size="small"
              variant="filled"
              sx={{ fontWeight: 600, minWidth: 100 }}
            />
          ) : (
            <Chip
              label="Gözləyir"
              color="warning"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600, minWidth: 100 }}
            />
          )}
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{name}</TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{surname}</TableCell>
        <TableCell>{fatherName}</TableCell>
        <TableCell>{dob}</TableCell>
        <TableCell>{sex}</TableCell>
        <TableCell>{pob}</TableCell>
        <TableCell>{serial}</TableCell>
        <TableCell>{natId}</TableCell>
        <TableCell>{phone}</TableCell>
        <TableCell
          sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {email}
        </TableCell>
        <TableCell>{edu}</TableCell>
        <TableCell>{uni}</TableCell>
        <TableCell>{profession}</TableCell>
        <TableCell sx={{ minWidth: 200 }} className="secret-key-cell">
          <SecretKeyCell value={secret} />
        </TableCell>
        <TableCell align="center">
          {hours} saat {minutes} dəq
        </TableCell>
        <TableCell sx={{ fontSize: "0.75rem" }}>{acceptedAt}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Ətrafli məlumat">
              <IconButton
                size="small"
                onClick={() => handleViewDetails(user)}
                sx={{
                  ...createActionButtonStyles("success"),
                  color: "success.main",
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MdOpenInNew size={16} />
              </IconButton>
            </Tooltip>
            {currentAdmin?.role === "superadmin" && (
              <Tooltip title="Məlumatları redaktə et">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/admin/users/${userId}/edit`)}
                  sx={{
                    ...createActionButtonStyles("success"),
                    color: "primary.main",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MdEdit size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const headerChildren = (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
      >
        {/* Search Section */}
        <Box sx={{ flex: 1, width: "100%" }}>
          <TableSearch
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            totalCount={data.length}
            colorScheme="primary"
            countLabel="qəbul edilən"
            placeholder={searchPlaceholder}
            isMobile={isMobile}
            isLoading={loading}
          />
        </Box>

        {/* Export Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: { xs: "100%", md: "auto" },
            mt: { xs: 1, md: 0 },
          }}
        >
          <ExportButton
            onClick={handleExportToExcel}
            loading={exporting}
            disabled={data.length === 0 || loading}
            variant="contained"
            color="success"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            }}
          ></ExportButton>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <>
      <DataTable
        data={data}
        loading={loading}
        error={error}
        columns={columns}
        colorScheme="success"
        minWidth={1500}
        title="Qəbul edilən müraciətlər"
        headerChildren={headerChildren}
        isMobile={isMobile}
        renderMobileCard={renderMobileCard}
        renderRow={renderRow}
        emptyTitle="Heç bir qəbul edilən müraciət tapılmadı"
        emptySubtitle="Axtarış şərtlərini dəyişdirin və ya yenidən cəhd edin"
        loadingMessage="Qəbul edilən müraciətlər yüklənir..."
      />

      <ApplicantDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        applicant={selectedApplicant}
        onActionComplete={handleActionComplete}
      />
    </>
  );
}
