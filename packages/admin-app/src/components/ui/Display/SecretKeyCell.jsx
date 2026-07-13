import * as React from "react";
import { Stack, IconButton, Tooltip, Typography, Box } from "@mui/material";
import { MdContentCopy, MdCheck } from "react-icons/md";

export default function SecretKeyCell({ value }) {
  const [copied, setCopied] = React.useState(false);
  const text = String(value || "");
  const short =
    text.length > 16 ? `${text.slice(0, 8)}…${text.slice(-6)}` : text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minWidth: { xs: 180, sm: 200, md: 220 },
        maxWidth: { xs: 220, sm: 250, md: 280 },
        p: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "grey.200",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.light",
          bgcolor: "primary.light",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 16px rgba(54, 79, 107, 0.15)",
          "& .MuiTypography-root": {
            color: "white",
          },
          "& .MuiIconButton-root": {
            bgcolor: "rgba(255, 255, 255, 0.15)",
            color: "white",
          },
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 0.75, sm: 1 }}
        justifyContent="space-between"
      >
        <Tooltip
          title={
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                wordBreak: "break-all",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {text}
            </Typography>
          }
          arrow
          placement="top"
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily:
                "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              color: "primary.main",
              fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
              letterSpacing: "0.5px",
              cursor: "help",
            }}
          >
            {short}
          </Typography>
        </Tooltip>

        {text && (
          <Tooltip title={copied ? "Kopyalandı!" : "Kopyala"} placement="top">
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                width: { xs: 26, sm: 28, md: 30 },
                height: { xs: 26, sm: 28, md: 30 },
                borderRadius: 1.5,
                transition: "all 0.2s ease",
                bgcolor: copied ? "success.light" : "transparent",
                color: copied ? "success.dark" : "primary.main",
                "&:hover": {
                  bgcolor: copied ? "success.main" : "primary.light",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              {copied ? <MdCheck size={12} /> : <MdContentCopy size={12} />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}
