import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { MdPerson, MdEmail, MdSchedule, MdDateRange } from "react-icons/md";
import StatusChip from "../../ui/Display/StatusChip";
import { formatDate } from "../../../utils/formatters";
import { createCardStyles } from "../../../styles/commonStyles";

export default function AdminCard({ admin }) {
  return (
    <Card sx={{ ...createCardStyles(), mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Header with Name and Status */}
          <Grid item xs={12}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 0,
                  bgcolor: admin.is_active ? "primary.main" : "grey.400",
                  color: "white",
                }}
              >
                <MdPerson size={20} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "primary.main",
                    mb: 0.5,
                  }}
                >
                  {admin.name || admin.email.split("@")[0]}
                </Typography>
                <StatusChip status={admin.is_active} />
              </Box>
            </Stack>
          </Grid>

          <Divider sx={{ width: "100%", mx: 2, my: 1 }} />

          {/* Contact Information */}
          <Grid item xs={12}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    bgcolor: "secondary.light",
                    color: "white",
                  }}
                >
                  <MdEmail size={16} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  {admin.email}
                </Typography>
              </Stack>

              {admin.last_login_at && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 0,
                      bgcolor: "info.light",
                      color: "white",
                    }}
                  >
                    <MdSchedule size={16} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block" }}
                    >
                      Son giriş
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(admin.last_login_at, "DD.MM.YYYY HH:mm")}
                    </Typography>
                  </Box>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    bgcolor: "warning.light",
                    color: "white",
                  }}
                >
                  <MdDateRange size={16} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                  >
                    Yaradılma tarixi
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDate(admin.created_at, "DD.MM.YYYY HH:mm")}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
