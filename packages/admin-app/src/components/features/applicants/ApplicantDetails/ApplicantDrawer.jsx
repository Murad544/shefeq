import * as React from "react";
import {
  Drawer,
  Box,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Container,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MdClose, MdPerson } from "react-icons/md";

import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";
import DocumentInfo from "./DocumentInfo";
import EducationInfo from "./EducationInfo";
import SkillsInfo from "./SkillsInfo";
import SecretKeyInfo from "./SecretKeyInfo";
import AnswersInfo from "./AnswersInfo";
import FilesInfo from "./FilesInfo";
import ActionButtons from "./ActionButtons";
import GameAccountInfo from "./GameAccountInfo";
import StatusChip from "../../../ui/Display/StatusChip";

import { useApplicantDetail } from "../../../../hooks/data/useApplicantDetail";
import { useApplicantActions } from "../../../../hooks/data/useApplicantActions";
import { useQuestionsMap } from "../../../../hooks/data/useQuestionsMap";
import {
  readField,
  formatDate,
  parseSkills,
  formatEducationLevel,
  formatProfession,
} from "../../../../utils/formatters";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MobileHandle() {
  return (
    <Box
      sx={{
        width: 48,
        height: 4,
        borderRadius: 2,
        bgcolor: "grey.300",
        mx: "auto",
        mt: 1.5,
        mb: 2,
      }}
    />
  );
}

function DrawerHeader({ isMobile, user, id, onClose, isOnline }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: "background.paper",
        borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        boxShadow: "0 2px 8px rgba(54, 79, 107, 0.08)",
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 4 } }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ py: { xs: 2, md: 2.5 } }}
        >
          <Grid item xs="auto">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <MdPerson size={20} />
            </Box>
          </Grid>

          <Grid item xs>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                Müraciət #{user?.id ?? id}
              </Typography>
              {isOnline !== null && (
                <StatusChip status={isOnline} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              {user?.name && user?.surname
                ? `${user.name} ${user.surname}`
                : "Müraciət detalları"}
            </Typography>
          </Grid>

          <Grid item xs="auto">
            <Tooltip title="Bağla">
              <IconButton
                onClick={onClose}
                aria-label="Bağla"
                sx={{
                  color: "text.secondary",
                  bgcolor: "grey.100",
                  "&:hover": {
                    bgcolor: "grey.200",
                    color: "text.primary",
                  },
                }}
              >
                <MdClose size={isMobile ? 18 : 20} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Fetches and derives all data needed to render the drawer content.
 * Keeps ApplicantDrawer free of memoization clutter.
 */
function useApplicantDrawerData(applicant) {
  const id = applicant?.id || applicant?.application_id;
  const { data, loading, error } = useApplicantDetail(id);
  const { map: qmap } = useQuestionsMap();

  const user = React.useMemo(
    () => data?.user ?? applicant ?? {},
    [data?.user, applicant],
  );

  const personalFields = React.useMemo(
    () => [
      ["Ad", readField(user, "name")],
      ["Soyad", readField(user, "surname")],
      ["Ata adı", readField(user, "father_name", "fatherName")],
      [
        "Doğum tarixi",
        formatDate(readField(user, "date_of_birth", "dateOfBirth")),
      ],
      ["Cins", readField(user, "sex")],
      ["Doğum yeri", readField(user, "place_of_birth", "placeOfBirth")],
    ],
    [user],
  );

  const documentFields = React.useMemo(
    () => [
      [
        "Seriya №",
        readField(user, "national_serial_num", "nationalSerialNumber"),
      ],
      ["FIN", readField(user, "national_id_num", "nationalIdNumber")],
    ],
    [user],
  );

  const contactFields = React.useMemo(
    () => [
      ["Telefon", readField(user, "phone_number", "phoneNumber")],
      ["E-poçt", readField(user, "email")],
    ],
    [user],
  );

  const educationFields = React.useMemo(
    () => [
      [
        "Təhsil",
        formatEducationLevel(
          readField(user, "education_level", "educationLevel"),
        ),
      ],
      ["Universitet", readField(user, "university")],
      ["Peşə", formatProfession(readField(user, "profession"))],
    ],
    [user],
  );

  const skills = React.useMemo(
    () => parseSkills(readField(user, "skills")),
    [user],
  );

  const secretKey = React.useMemo(
    () => readField(user, "secret_key", "secretKey"),
    [user],
  );

  const answers = data?.answers ?? [];
  const files = data?.files ?? [];
  const gameAccount = data?.gameAccount ?? null;
  const hasGameSessions = (gameAccount?.sessions?.length ?? 0) > 0;
  const isOnline = hasGameSessions
    ? gameAccount.sessions[0].logout === null
    : null;

  return {
    id,
    user,
    loading,
    error,
    qmap,
    personalFields,
    documentFields,
    contactFields,
    educationFields,
    skills,
    secretKey,
    answers,
    files,
    gameAccount,
    hasGameSessions,
    isOnline,
  };
}

/**
 * Returns the correct MUI Drawer component and its props based on breakpoint.
 */
function useDrawerProps(open, onClose, theme, isMobile) {
  const DrawerComponent = isMobile ? SwipeableDrawer : Drawer;

  const drawerProps = React.useMemo(() => {
    if (isMobile) {
      return {
        anchor: "bottom",
        open,
        onClose,
        onOpen: () => {},
        disableSwipeToOpen: true,
        PaperProps: {
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "92vh",
            bgcolor: "background.default",
            backdropFilter: "blur(8px)",
          },
        },
      };
    }

    return {
      anchor: "right",
      open,
      onClose,
      keepMounted: true,
      PaperProps: {
        sx: {
          width: { md: 520, lg: 600, xl: 680 },
          bgcolor: "background.default",
          borderLeft: `1px solid ${theme.palette.grey[200]}`,
        },
      },
    };
  }, [isMobile, open, onClose, theme]);

  return { DrawerComponent, drawerProps };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ApplicantDrawer({
  open,
  onClose,
  applicant,
  onActionComplete,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Stable ref so the action callback always sees the latest onClose
  // without needing it as a dep in useApplicantActions.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleActionComplete = React.useCallback(
    (action, user) => {
      onActionComplete?.(action, user);
      setTimeout(() => onCloseRef.current(), 2000);
    },
    [onActionComplete],
  );

  const applicantActions = useApplicantActions(applicant, handleActionComplete);
  const { DrawerComponent, drawerProps } = useDrawerProps(
    open,
    onClose,
    theme,
    isMobile,
  );

  const {
    id,
    user,
    loading,
    error,
    qmap,
    personalFields,
    documentFields,
    contactFields,
    educationFields,
    skills,
    secretKey,
    answers,
    files,
    gameAccount,
    hasGameSessions,
    isOnline,
  } = useApplicantDrawerData(applicant);

  return (
    <DrawerComponent {...drawerProps}>
      {isMobile && <MobileHandle />}

      <DrawerHeader isMobile={isMobile} user={user} id={id} onClose={onClose} isOnline={isOnline} />

      <ActionButtons applicant={applicant} {...applicantActions} />

      <Box
        sx={{
          height: isMobile ? "calc(92vh - 100px)" : "auto",
          overflowY: "auto",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <PersonalInfo loading={loading} personalFields={personalFields} />
          <DocumentInfo loading={loading} documentFields={documentFields} />
          <ContactInfo loading={loading} contactFields={contactFields} />
          <EducationInfo loading={loading} educationFields={educationFields} />
          <SkillsInfo loading={loading} skills={skills} isMobile={isMobile} />
          <SecretKeyInfo loading={loading} secretKey={secretKey} />
          {hasGameSessions && (
            <GameAccountInfo loading={loading} gameAccount={gameAccount} />
          )}
          <AnswersInfo
            loading={loading}
            error={error}
            answers={answers}
            qmap={qmap}
          />
          <FilesInfo loading={loading} files={files} />
        </Container>
      </Box>
    </DrawerComponent>
  );
}
