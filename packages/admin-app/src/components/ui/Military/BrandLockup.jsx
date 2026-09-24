import { Box } from "@mui/material";
import Logo from "../../../assets/Logo";
import { BRAND } from "../../../config/brand";
import { C, FONT } from "../../../styles/tokens";

const SIZES = {
  sm: { logo: 36, mark: "1.2rem", descriptor: "0.54rem", gap: 1.25 },
  md: { logo: 44, mark: "1.45rem", descriptor: "0.6rem", gap: 1.5 },
  lg: { logo: 54, mark: "1.75rem", descriptor: "0.68rem", gap: 1.75 },
};

// Official lockup: MMU crest, the "FPV" wordmark and the "TƏDRİS ALT SİSTEMİ"
// descriptor beneath it. `tag` adds a ruled section label (e.g. admin panel).
const BrandLockup = ({ size = "md", dark = true, logo = true, tag, sx }) => {
  const s = SIZES[size] || SIZES.md;

  return (
    <Box
      sx={{ display: "inline-flex", alignItems: "center", gap: s.gap, minWidth: 0, ...sx }}
    >
      {logo && <Logo size={s.logo} />}
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: s.mark,
            letterSpacing: "0.16em",
            lineHeight: 1,
            color: dark ? C.textOnDark : C.text,
          }}
        >
          {BRAND.PROJECT_MARK.toLocaleUpperCase("az")}
        </Box>
        {BRAND.PROJECT_DESCRIPTOR && (
          <Box
            sx={{
              fontFamily: FONT.display,
              fontWeight: 600,
              fontSize: s.descriptor,
              letterSpacing: "0.22em",
              lineHeight: 1.2,
              mt: 0.5,
              color: dark ? C.brass : C.brassDark,
              whiteSpace: "nowrap",
            }}
          >
            {BRAND.PROJECT_DESCRIPTOR.toLocaleUpperCase("az")}
          </Box>
        )}
      </Box>
      {tag && (
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            alignSelf: "stretch",
            pl: s.gap,
            ml: 0.5,
            borderLeft: `1px solid ${dark ? C.lineDarkStrong : C.rule}`,
            fontFamily: FONT.display,
            fontWeight: 600,
            fontSize: s.descriptor,
            letterSpacing: "0.22em",
            color: dark ? C.textOnDarkMuted : C.textMuted,
            whiteSpace: "nowrap",
          }}
        >
          {String(tag).toLocaleUpperCase("az")}
        </Box>
      )}
    </Box>
  );
};

export default BrandLockup;
