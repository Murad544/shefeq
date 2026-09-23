import {
  AssignmentTurnedIn as StatusIcon,
  CheckCircle as CheckCircleIcon,
  HourglassTop as PendingIcon,
} from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import Panel from "../military/Panel";
import Stamp from "../military/Stamp";
import { C, FONT, labelCaps } from "../../config/tokens";

const Row = ({ label, children, last }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
    sx={{ py: 1.75, borderBottom: last ? "none" : `1px dashed ${C.ruleStrong}` }}
  >
    <Box sx={{ ...labelCaps, fontSize: "0.72rem", color: C.textMuted }}>{label}</Box>
    <Box sx={{ textAlign: "right", minWidth: 0 }}>{children}</Box>
  </Stack>
);

const ApplicationStatusCard = ({ applicationStatus }) => {
  const approved = applicationStatus?.current === "Təsdiqlənib";
  const complianceOk = applicationStatus?.compliance === "Təsdiqlənib";

  return (
    <Panel title="Müraciət Statusu" icon={<StatusIcon />} sx={{ mb: 3 }} bodySx={{ py: 1 }}>
      <Row label="Hazırkı Status">
        <Stamp
          label={applicationStatus?.current || "-"}
          tone={approved ? "green" : "amber"}
          size="sm"
          rotate={-4}
          delay={300}
        />
      </Row>
      <Row label="Təsdiqlənmə Tarixi">
        <Box sx={{ fontFamily: FONT.mono, fontSize: "0.95rem" }}>
          {applicationStatus?.confirmationDate || "—"}
        </Box>
      </Row>
      <Row label="Uyğunluq" last>
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
          {complianceOk ? (
            <CheckCircleIcon sx={{ fontSize: 18, color: C.green }} />
          ) : (
            <PendingIcon sx={{ fontSize: 18, color: C.amber }} />
          )}
          <Box sx={{ fontWeight: 500 }}>{applicationStatus?.compliance || "-"}</Box>
        </Stack>
      </Row>
    </Panel>
  );
};

export default ApplicationStatusCard;
