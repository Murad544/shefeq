import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Collapse,
  Divider,
  Stack,
} from "@mui/material";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdExpandMore,
  MdExpandLess,
  MdOpenInNew,
} from "react-icons/md";
import SecretKeyCell from "../../ui/Display/SecretKeyCell";
import { formatDate, readField, formatEducationLevel, formatProfession } from "../../../utils/formatters";

export default function AcceptedApplicantCard({ user, onViewDetails }) {
  const [expanded, setExpanded] = React.useState(false);

  const name = readField(user, "name");
  const surname = readField(user, "surname");
  const fatherName = readField(user, "father_name", "fatherName");
  const email = readField(user, "email");
  const phone = readField(user, "phone_number", "phoneNumber");
  const dob = formatDate(readField(user, "date_of_birth", "dateOfBirth"));
  const sex = readField(user, "sex");
  const education = formatEducationLevel(
    readField(user, "education_level", "educationLevel"),
  );
  const university = readField(user, "university");
  const profession = formatProfession(readField(user, "profession"));
  const secret = readField(user, "secret_key", "secretKey");
  const acceptedAt = formatDate(readField(user, "accepted_at"));

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 0,
        border: "1px solid",
        borderColor: "grey.200",
        boxShadow: "0 2px 12px rgba(16, 21, 15, 0.08)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "success.light",
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs="auto">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 0,
                  bgcolor: "success.main",
                  color: "white",
                }}
              >
                <MdPerson size={20} />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "primary.main",
                  mb: 0.5,
                }}
              >
                {name} {surname}
              </Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Chip
                    label={sex}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      borderColor: "secondary.light",
                      color: "secondary.main",
                    }}
                  />
                </Grid>
                {dob && (
                  <Grid item xs={12} sx={{ mt: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                    >
                      {dob} {fatherName && `• Ata adı: ${fatherName}`}
                    </Typography>
                  </Grid>
                )}
                {acceptedAt && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "success.dark",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      Qəbul tarixi: {acceptedAt}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item xs="auto">
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    color: "secondary.main",
                    border: "1px solid",
                    borderColor: "secondary.light",
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor: "secondary.light",
                      color: "white",
                    },
                  }}
                >
                  {expanded ? (
                    <MdExpandLess size={16} />
                  ) : (
                    <MdExpandMore size={16} />
                  )}
                </IconButton>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => onViewDetails(user)}
                  startIcon={<MdOpenInNew size={14} />}
                  sx={{
                    fontSize: "0.75rem",
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                    borderRadius: 0,
                    fontWeight: 600,
                  }}
                >
                  Detallar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Contact Info */}
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Grid container spacing={1.5}>
            {email && (
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: 0,
                      bgcolor: "secondary.light",
                      color: "white",
                    }}
                  >
                    <MdEmail size={12} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "text.primary",
                      fontWeight: 500,
                    }}
                  >
                    {email}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {phone && (
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: 0,
                      bgcolor: "info.light",
                      color: "white",
                    }}
                  >
                    <MdPhone size={12} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                  >
                    {phone}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Expandable Details */}
        <Collapse in={expanded}>
          <Divider sx={{ borderColor: "grey.200" }} />
          <Box sx={{ p: 2.5, pt: 2, bgcolor: "grey.50" }}>
            <Grid container spacing={3}>
              {/* Education & Career */}
              {(education || university || profession) && (
                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      display: "block",
                      mb: 1.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.7rem",
                    }}
                  >
                    TƏHSİL VƏ PEŞƏ
                  </Typography>
                  <Stack spacing={1}>
                    {education && (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {education}
                      </Typography>
                    )}
                    {university && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {university}
                      </Typography>
                    )}
                    {profession && (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {profession}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              )}

              {/* Secret Key */}
              {secret && (
                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      display: "block",
                      mb: 1.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.7rem",
                    }}
                  >
                    GİZLİ AÇAR
                  </Typography>
                  <SecretKeyCell value={secret} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
