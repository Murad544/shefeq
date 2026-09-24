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
import CountUp from "../../ui/Military/CountUp";
import StatusLed from "../../ui/Military/StatusLed";
import { C, FONT, labelCaps } from "../../../styles/tokens";
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
    const serial = readField(user, "national_serial_num");
    const natId = readField(user, "national_id_num");
    const email = readField(user, "email");

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
        <TableCell align="left">
          <StatusLed
            on={!!user.is_online}
            size={9}
            label={user.is_online ? "Onlayn" : "Oflayn"}
            labelSx={{
              fontWeight: 600,
              color: user.is_online ? C.green : C.textFaint,
            }}
          />
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{name}</TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{surname}</TableCell>
        <TableCell
          sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {email}
        </TableCell>
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
                  onClick={() => navigate(`/users/${userId}/edit`)}
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

  const summary = [
    { label: "Qəbul edilən", value: data.length },
    { label: "Aktiv hesab", value: data.filter((u) => readField(u, "user_id")).length },
    { label: "Hazırda onlayn", value: data.filter((u) => u.is_online).length, led: true },
  ];

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
            variant="outlined"
            color="secondary"
            sx={{
              color: C.textOnDark,
              borderColor: C.lineDarkStrong,
              "&:hover": {
                bgcolor: C.brass,
                borderColor: C.brass,
                color: C.ink,
              },
              "&.Mui-disabled": {
                color: C.textOnDarkMuted,
                borderColor: C.lineDark,
              },
            }}
          />
        </Box>
      </Stack>

      {/* Live summary derived from the loaded list */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          mt: 2,
          border: `1px solid ${C.lineDark}`,
          maxWidth: 560,
        }}
      >
        {summary.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              px: 1.75,
              py: 1.25,
              borderLeft: index ? `1px solid ${C.lineDark}` : "none",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {item.led && <StatusLed on={item.value > 0} pulse={false} size={7} />}
              <Box sx={{ fontFamily: FONT.mono, fontSize: "1.3rem", color: C.textOnDark, lineHeight: 1.1 }}>
                <CountUp value={item.value} />
              </Box>
            </Stack>
            <Box sx={{ ...labelCaps, fontSize: "0.64rem", color: C.textOnDarkMuted, mt: 0.25 }}>
              {item.label}
            </Box>
          </Box>
        ))}
      </Box>
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
