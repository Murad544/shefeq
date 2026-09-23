import { Alert } from "@mui/material";

export default function ErrorAlert({
  error,
  severity = "error",
  sx = {},
  ...props
}) {
  if (!error) return null;

  const errorMessage =
    typeof error === "string" ? error : error?.message || "Xəta baş verdi";

  return (
    <Alert
      severity={severity}
      sx={{
        mb: 3,
        animation: "sg-fade-up .35s ease backwards",
        ...sx,
      }}
      {...props}
    >
      {errorMessage}
    </Alert>
  );
}
