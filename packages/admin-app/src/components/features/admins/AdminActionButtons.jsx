import { Box, Button } from "@mui/material";
import { useAdminActions } from "../../../hooks/data/useAdminActions";

export default function AdminActionButtons({ admin }) {
  const {
    activating,
    deactivating,
    handleActivateAdmin,
    handleDeactivateAdmin,
    isActivated,
  } = useAdminActions(admin);

  return (
    <Box>
      {isActivated ? (
        <Button
          size="small"
          onClick={handleDeactivateAdmin}
          disabled={deactivating}
          sx={{
            bgcolor: "rgba(219, 52, 52, 0.8)",
            color: "white",
            fontWeight: 400,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "0 10px",
            "&:hover": { bgcolor: "rgba(219, 52, 52, 1)" },
          }}
        >
          {deactivating ? "Deaktivləşdirilir..." : "Deaktivə Et"}
        </Button>
      ) : (
        <Button
          size="small"
          onClick={handleActivateAdmin}
          disabled={activating}
          sx={{
            bgcolor: "rgba(80, 153, 80, 0.59)",
            color: "white",
            fontWeight: 400,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "0 10px",
            "&:hover": { bgcolor: "rgba(91, 163, 91, 1)" },
          }}
        >
          {activating ? "Aktivləşdirilir..." : "Aktivə Et"}
        </Button>
      )}
    </Box>
  );
}
