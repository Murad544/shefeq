import React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { MdCheck, MdClose, MdOpenInNew } from "react-icons/md";
import DataTable from "../../ui/Table/DataTable";
import TableSearch from "../../ui/Table/TableSearch";
import ApplicantCard from "./ApplicantCard";
import ApplicantDrawer from "./ApplicantDetails/ApplicantDrawer";
import SkillsChips from "../../ui/Display/SkillsChips";
import SecretKeyCell from "../../ui/Display/SecretKeyCell";
import { useApplicants } from "../../../hooks/data/useApplicants";
import { useTableConfig } from "../../../hooks/utils/useTableConfig";
import { readField, formatDate, formatEducationLevel, formatProfession } from "../../../utils/formatters";
import {
  createHoverRowStyles,
  createActionButtonStyles,
} from "../../../styles/commonStyles";

export default function ApplicantsView() {
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedApplicant, setSelectedApplicant] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const { data, loading, error } = useApplicants(searchValue);

  // TODO: get a list of accepted applicants to pinpoint users whose id's matches those in the accepted applicants list
  // const { data: acceptedApplicants } = useAcceptedApplicants(searchValue);
  const { columns, isMobile, searchPlaceholder } = useTableConfig(
    "applicants",
    "secondary",
  );

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedApplicant(null);
  };

  const renderMobileCard = (user) => (
    <ApplicantCard user={user} onViewDetails={handleViewDetails} />
  );

  const renderRow = (user) => {
    const id = readField(user, "id");
    const name = readField(user, "name");
    const surname = readField(user, "surname");
    const fatherName = readField(user, "father_name", "fatherName");
    const dob = formatDate(readField(user, "date_of_birth", "dateOfBirth"));
    const sex = readField(user, "sex");
    const pob = readField(user, "place_of_birth", "placeOfBirth");
    const serial = readField(
      user,
      "national_serial_num",
      "nationalSerialNumber",
    );
    const natId = readField(user, "national_id_num", "nationalIdNumber");
    const phone = readField(user, "phone_number", "phoneNumber");
    const email = readField(user, "email");
    const edu = formatEducationLevel(
      readField(user, "education_level", "educationLevel"),
    );
    const uni = readField(user, "university");
    const profession = formatProfession(readField(user, "profession"));
    const skills = readField(user, "skills");
    const secret = readField(user, "secret_key", "secretKey");
    const totalSeconds = user?.total_duration_seconds || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return (
      <TableRow
        key={id || `${email}-${serial}-${natId}`}
        sx={createHoverRowStyles("primary")}
      >
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
        <TableCell sx={{ minWidth: 200 }}>
          <SkillsChips
            value={skills}
            limit={3}
            sx={{ pointerEvents: "none" }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 200 }} className="secret-key-cell">
          <SecretKeyCell value={secret} />
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2">
            {hours} saat {minutes} dəq
          </Typography>
        </TableCell>
        <TableCell>
          <Tooltip title="Ətraflı məlumat">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(user)}
              sx={{
                ...createActionButtonStyles("primary"),
                color: "primary.main",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MdOpenInNew size={16} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  const headerChildren = (
    <TableSearch
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      totalCount={data.length}
      colorScheme="primary"
      countLabel="müraciət"
      placeholder={searchPlaceholder}
      isMobile={isMobile}
      isLoading={loading}
    />
  );

  return (
    <>
      <DataTable
        data={data}
        loading={loading}
        error={error}
        columns={columns}
        colorScheme="secondary"
        minWidth={1400}
        title="Müraciətlər"
        headerChildren={headerChildren}
        isMobile={isMobile}
        renderMobileCard={renderMobileCard}
        renderRow={renderRow}
        emptyTitle="Heç bir müraciət tapılmadı"
        emptySubtitle="Axtarış şərtlərini dəyişdirin və ya yenidən cəhd edin"
        loadingMessage="Müraciətlər yüklənir..."
      />

      <ApplicantDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        applicant={selectedApplicant}
      />
    </>
  );
}
