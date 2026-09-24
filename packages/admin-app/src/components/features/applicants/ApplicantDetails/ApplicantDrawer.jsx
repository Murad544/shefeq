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
import CornerBrackets from "../../../ui/Military/CornerBrackets";
import TacticalBackground from "../../../ui/Military/TacticalBackground";
import TricolorBar from "../../../ui/Military/TricolorBar";
import { C, FONT } from "../../../../styles/tokens";

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
    <Box sx={{ bgcolor: C.field900, pt: 1.25, pb: 0.5 }}>
      <Box
        sx={{
          width: 48,
          height: 4,
          bgcolor: C.lineDarkStrong,
          mx: "auto",
        }}
      />
    </Box>
  );
}

function DrawerHeader({ isMobile, user, onClose, isOnline }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: C.field900,
        color: C.textOnDark,
        overflow: "hidden",
        // The drawer paper is a flex column; overflow:hidden would otherwise
        // let this header shrink when the dossier content is tall.
        flexShrink: 0,
      }}
    >
      <TricolorBar height={4} />
      <TacticalBackground topo={false} />
      <Container maxWidth={false} sx={{ position: "relative", px: { xs: 3, md: 4 } }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ py: { xs: 2, md: 2.5 } }}
        >
          <Grid item xs="auto">
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 56,
                bgcolor: C.field700,
                border: `1px solid ${C.lineDarkStrong}`,
                color: C.brass,
              }}
            >
              <CornerBrackets size={8} inset={-4} />
              {user?.name ? (
                <Box sx={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: "1.6rem" }}>
                  {String(user.name).charAt(0)}
                </Box>
              ) : (
                <MdPerson size={22} />
              )}
            </Box>
          </Grid>

          <Grid item xs sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  fontFamily: FONT.mono,
                  fontSize: { xs: "0.72rem", md: "0.78rem" },
                  letterSpacing: "0.12em",
                  color: C.brass,
                }}
              >
                MÜRACİƏT DOSYESİ
              </Box>
              {isOnline !== null && (
                <StatusChip status={isOnline} />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: { xs: "1.25rem", md: "1.55rem" },
                lineHeight: 1.2,
                wordBreak: "break-word",
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
                  color: C.textOnDark,
                  border: `1px solid ${C.lineDarkStrong}`,
                  "&:hover": {
                    bgcolor: C.brass,
                    borderColor: C.brass,
                    color: C.ink,
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

      <DrawerHeader isMobile={isMobile} user={user} onClose={onClose} isOnline={isOnline} />

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
