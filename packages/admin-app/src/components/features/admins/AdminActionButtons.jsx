import { Box, Button } from "@mui/material";
import { useAdminActions } from "../../../hooks/data/useAdminActions";
import { C } from "../../../styles/tokens";

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
          variant="outlined"
          onClick={handleDeactivateAdmin}
          disabled={deactivating}
          sx={{
            color: C.red,
            borderColor: "rgba(168, 50, 42, 0.5)",
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: C.red, borderColor: C.red, color: "#fff" },
          }}
        >
          {deactivating ? "Deaktivləşdirilir..." : "Deaktivə Et"}
        </Button>
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={handleActivateAdmin}
          disabled={activating}
          sx={{
            color: C.green,
            borderColor: "rgba(62, 123, 58, 0.5)",
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: C.green, borderColor: C.green, color: "#fff" },
          }}
        >
          {activating ? "Aktivləşdirilir..." : "Aktivə Et"}
        </Button>
      )}
    </Box>
  );
}
