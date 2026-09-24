import * as React from "react";
import { Stack, IconButton, Tooltip, Typography, Box } from "@mui/material";
import { MdContentCopy, MdCheck, MdKey } from "react-icons/md";
import { C, FONT } from "../../../styles/tokens";

// Secret key readout in a dark mono "terminal" strip with copy action.
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
      className="secret-key-cell"
      sx={{
        minWidth: { xs: 180, sm: 200, md: 220 },
        maxWidth: { xs: 240, sm: 270, md: 300 },
        pl: 1.25,
        pr: 0.5,
        py: 0.5,
        bgcolor: C.field900,
        border: `1px solid ${C.field600}`,
        transition: "border-color .2s",
        "&:hover": { borderColor: C.brass },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
        <Box sx={{ color: C.brass, display: "flex" }}>
          <MdKey size={14} />
        </Box>
        <Tooltip
          title={
            <Typography
              variant="caption"
              sx={{ fontFamily: FONT.mono, wordBreak: "break-all", fontSize: "0.72rem" }}
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
              fontFamily: FONT.mono,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              color: C.textOnDark,
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              letterSpacing: "0.06em",
              cursor: "help",
            }}
          >
            {short || "—"}
          </Typography>
        </Tooltip>

        {text && (
          <Tooltip title={copied ? "Kopyalandı!" : "Kopyala"} placement="top">
            <IconButton
              size="small"
              onClick={handleCopy}
              aria-label="Kopyala"
              sx={{
                width: 28,
                height: 28,
                color: copied ? "#62B85A" : C.textOnDarkMuted,
                "&:hover": { bgcolor: C.brass, color: C.ink },
              }}
            >
              {copied ? <MdCheck size={14} /> : <MdContentCopy size={13} />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}
