import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import CollapsibleSection from "../common/CollapsibleSection";

const AccountInfoSection = ({ contactInfo }) => {
  return (
    <CollapsibleSection title="Hesab Məlumatları" icon={LockIcon}>
      <List disablePadding>
        <ListItem
          sx={{
            px: 0,
            py: 1.5,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
          >
            EMAİL ÜNVANI
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" fontWeight={500}>
              {contactInfo?.email || "-"}
            </Typography>
            {contactInfo?.emailVerified && (
              <CheckCircleIcon sx={{ fontSize: 18, color: "#16a085" }} />
            )}
          </Box>
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            px: 0,
            py: 1.5,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
          >
            TELEFON NÖMRƏSİ
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {contactInfo?.phone || "-"}
          </Typography>
        </ListItem>
      </List>
    </CollapsibleSection>
  );
};

export default AccountInfoSection;
