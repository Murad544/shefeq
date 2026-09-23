import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { Box, Grid, Tooltip } from "@mui/material";
import CollapsibleSection from "../common/CollapsibleSection";
import DataField from "../military/DataField";
import { C } from "../../config/tokens";

const AccountInfoSection = ({ contactInfo }) => {
  return (
    <CollapsibleSection title="Hesab Məlumatları" icon={LockIcon} defaultOpen>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DataField
            label="Email ünvanı"
            mono
            value={
              contactInfo?.email ? (
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                  {contactInfo.email}
                  {contactInfo?.emailVerified && (
                    <Tooltip title="Təsdiqlənib">
                      <CheckCircleIcon sx={{ fontSize: 18, color: C.green }} />
                    </Tooltip>
                  )}
                </Box>
              ) : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DataField label="Telefon nömrəsi" mono value={contactInfo?.phone} />
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
};

export default AccountInfoSection;
