import { Box } from "@mui/material";
import { C } from "../../config/tokens";
import emblemSrc from "../../assets/icons/Azerbaijani_Armed_Forces_logo.png";

// Armed Forces emblem tinted through a CSS mask (the PNG is line art on alpha).
const Emblem = ({
  size = 120,
  color = C.brass,
  opacity = 1,
  title = "Azərbaycan Silahlı Qüvvələrinin emblemi",
  decorative = false,
  sx,
}) => (
  <Box
    role={decorative ? undefined : "img"}
    aria-label={decorative ? undefined : title}
    aria-hidden={decorative || undefined}
    sx={{
      width: size,
      height: size * 1.25,
      flexShrink: 0,
      bgcolor: color,
      opacity,
      WebkitMaskImage: `url(${emblemSrc})`,
      maskImage: `url(${emblemSrc})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      ...sx,
    }}
  />
);

export default Emblem;
