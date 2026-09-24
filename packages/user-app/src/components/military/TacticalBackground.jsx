import { Box } from "@mui/material";
import { C, gridBackground, topoDataUri } from "../../config/tokens";

const TOPO_DARK = topoDataUri(C.brass, 0.14);
const TOPO_LIGHT = topoDataUri(C.olive, 0.13);

// Decorative backdrop: map grid, topographic contours and a vignette.
// Place inside a position: relative container.
const TacticalBackground = ({
  tone = "dark",
  grid = true,
  topo = true,
  vignette = true,
  sx,
}) => {
  const dark = tone === "dark";

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        ...sx,
      }}
    >
      {grid && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            ...gridBackground(
              dark ? "rgba(214, 200, 150, 0.045)" : "rgba(75, 83, 32, 0.05)",
              dark ? "rgba(214, 200, 150, 0.09)" : "rgba(75, 83, 32, 0.09)"
            ),
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 45%, #000 35%, transparent 85%)",
            maskImage:
              "radial-gradient(ellipse at 50% 45%, #000 35%, transparent 85%)",
          }}
        />
      )}
      {topo && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: dark ? TOPO_DARK : TOPO_LIGHT,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {vignette && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: dark
              ? "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(11, 15, 10, 0.6) 100%)"
              : "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(201, 190, 150, 0.35) 100%)",
          }}
        />
      )}
    </Box>
  );
};

export default TacticalBackground;
