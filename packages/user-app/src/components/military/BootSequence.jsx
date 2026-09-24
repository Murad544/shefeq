import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Logo from "../../assets/icons/Logo";
import { BRAND } from "../../config/brand";
import { C, EASE, FONT, gridBackground } from "../../config/tokens";
import TricolorBar from "./TricolorBar";
import { LED_ON } from "./StatusLed";

const DEFAULT_LINES = [
  "SİSTEM İŞƏ SALINIR",
  "MODULLAR YÜKLƏNİR",
  "İNTERFEYS HAZIRLANIR",
];

const LINE_START = 650;
const LINE_STEP = 260;
const HOLD = 480;
const EXIT = 850;
const DOOR_DELAY = 120;

// Plays once per browser session; `?intro` in the URL forces a replay.
const shouldPlay = (storageKey) => {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  } catch (e) {
    // matchMedia unavailable: fall through and play.
  }
  try {
    if (/[?&]intro(=|&|$)/.test(window.location.search)) return true;
    return window.sessionStorage.getItem(storageKey) !== "1";
  } catch (e) {
    return true;
  }
};

const hud = {
  position: "absolute",
  display: { xs: "none", sm: "block" },
  fontFamily: FONT.mono,
  fontSize: "0.68rem",
  letterSpacing: "0.12em",
  color: C.textOnDarkMuted,
  animation: "sg-fade-in .6s ease .3s backwards",
};

const scopeRings = [
  "linear-gradient(rgba(201,166,70,.22), rgba(201,166,70,.22)) center / 100% 1px no-repeat",
  "linear-gradient(rgba(201,166,70,.22), rgba(201,166,70,.22)) center / 1px 100% no-repeat",
  "repeating-radial-gradient(circle at center, transparent 0, transparent 24px, rgba(201,166,70,.16) 24px, rgba(201,166,70,.16) 25px)",
].join(",");

// Full-screen start-up sequence: radar scope, insignia, title and a boot log,
// then the screen splits open like hangar doors to reveal the app.
const BootSequence = ({
  storageKey = "sg_boot_done",
  title = BRAND.PROJECT_MARK.toLocaleUpperCase("az"),
  subtitle = BRAND.PROJECT_DESCRIPTOR,
  tag = BRAND.PROJECT_NAME.toLocaleUpperCase("az"),
  lines = DEFAULT_LINES,
}) => {
  const [phase, setPhase] = useState(() => (shouldPlay(storageKey) ? "run" : "done"));
  const [shownLines, setShownLines] = useState(0);
  const lineCount = lines.length;
  const active = phase !== "done";
  const exiting = phase === "exit";
  const total = LINE_START + lineCount * LINE_STEP + HOLD;

  useEffect(() => {
    if (phase !== "run") return undefined;
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch (e) {
      // Storage blocked: the intro simply plays again next load.
    }
    const timers = Array.from({ length: lineCount }, (_, i) =>
      setTimeout(() => setShownLines(i + 1), LINE_START + i * LINE_STEP)
    );
    timers.push(
      setTimeout(() => setPhase("exit"), LINE_START + lineCount * LINE_STEP + HOLD)
    );
    const skip = () => setPhase("exit");
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
    };
  }, [phase, lineCount, storageKey]);

  useEffect(() => {
    if (phase !== "exit") return undefined;
    const timer = setTimeout(() => setPhase("done"), EXIT + DOOR_DELAY + 40);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!active) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (!active) return null;

  const progress = Math.round((shownLines / lineCount) * 100);

  return (
    <Box
      aria-hidden
      onClick={() => phase === "run" && setPhase("exit")}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        cursor: exiting ? "default" : "pointer",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {["top", "bottom"].map((side) => (
        <Box
          key={side}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            [side]: 0,
            height: "50.2%",
            bgcolor: C.night,
            ...gridBackground("rgba(214, 200, 150, 0.04)", "rgba(214, 200, 150, 0.08)"),
            [side === "top" ? "borderBottom" : "borderTop"]: `1px solid rgba(201, 166, 70, ${
              exiting ? 0.9 : 0.25
            })`,
            transition: "border-color .2s",
            animation: exiting
              ? `${side === "top" ? "sg-door-up" : "sg-door-down"} ${EXIT}ms ${EASE.inOut} ${DOOR_DELAY}ms forwards`
              : "none",
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scale(0.985)" : "none",
          transition: "opacity .3s ease, transform .3s ease",
        }}
      >
        <TricolorBar sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />
        <Box sx={{ ...hud, top: 22, left: 28 }}>{tag}</Box>
        <Box sx={{ ...hud, bottom: 22, right: 28 }}>KEÇMƏK ÜÇÜN KLİKLƏYİN</Box>

        <Box
          sx={{
            position: "relative",
            width: { xs: 168, sm: 208 },
            height: { xs: 168, sm: 208 },
            mb: 3.5,
            animation: `sg-scale-in .9s ${EASE.out} backwards`,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              background:
                "repeating-conic-gradient(from 0deg, rgba(201,166,70,.7) 0deg 1deg, transparent 1deg 15deg)",
              WebkitMaskImage:
                "radial-gradient(closest-side, transparent calc(100% - 7px), #000 calc(100% - 7px))",
              maskImage:
                "radial-gradient(closest-side, transparent calc(100% - 7px), #000 calc(100% - 7px))",
              animation: "sg-sweep 24s linear infinite reverse",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(201, 166, 70, 0.4)",
              background: scopeRings,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, rgba(201,166,70,0) 0deg, rgba(201,166,70,0) 260deg, rgba(201,166,70,.06) 290deg, rgba(201,166,70,.55) 359deg, rgba(201,166,70,0) 360deg)",
              animation: "sg-sweep 2.4s linear infinite",
            }}
          />
          <Box sx={{ position: "absolute", inset: "21%" }}>
            <Logo size="100%" />
          </Box>
        </Box>

        <Box
          sx={{
            fontFamily: FONT.serif,
            fontWeight: 700,
            fontSize: { xs: "2.6rem", sm: "3.5rem" },
            lineHeight: 1,
            color: C.textOnDark,
            letterSpacing: "0.28em",
            mr: "-0.28em",
            animation: `sg-track-in 1.1s ${EASE.out} .25s backwards`,
          }}
        >
          {title}
        </Box>
        <TricolorBar
          height={4}
          animate
          delay={450}
          sx={{ width: { xs: 180, sm: 240 }, my: 2.25 }}
        />
        <Box
          sx={{
            fontFamily: FONT.display,
            fontWeight: 600,
            fontSize: { xs: "0.74rem", sm: "0.86rem" },
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: C.brass,
            maxWidth: 560,
            animation: `sg-fade-up .7s ${EASE.out} .55s backwards`,
          }}
        >
          {subtitle}
        </Box>

        <Box
          sx={{
            mt: 4,
            width: { xs: 280, sm: 380 },
            minHeight: lineCount * 22,
            fontFamily: FONT.mono,
            fontSize: "0.74rem",
            color: C.textOnDarkMuted,
            textAlign: "left",
          }}
        >
          {lines.slice(0, shownLines).map((line) => (
            <Box
              key={line}
              sx={{
                display: "flex",
                gap: 1,
                lineHeight: "22px",
                animation: "sg-fade-in .25s ease backwards",
              }}
            >
              <Box component="span" sx={{ color: C.brass }}>
                &gt;
              </Box>
              <Box
                component="span"
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  "&::after": {
                    content: '" . . . . . . . . . . . . . . . . . . . . . . . ."',
                    opacity: 0.35,
                  },
                }}
              >
                {line}
              </Box>
              <Box component="span" sx={{ color: LED_ON }}>
                OK
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 1.5,
            width: { xs: 280, sm: 380 },
            height: 2,
            bgcolor: "rgba(214, 200, 150, 0.12)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              bgcolor: C.brass,
              transformOrigin: "left",
              animation: `sg-draw-x ${total}ms linear backwards`,
            }}
          />
        </Box>
        <Box
          sx={{
            mt: 1,
            width: { xs: 280, sm: 380 },
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT.mono,
            fontSize: "0.66rem",
            letterSpacing: "0.1em",
            color: C.textFaint,
          }}
        >
          <span>{shownLines === lineCount ? "HAZIRDIR" : "YÜKLƏNİR"}</span>
          <span>{progress}%</span>
        </Box>
      </Box>
    </Box>
  );
};

export default BootSequence;
