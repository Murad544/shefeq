import { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import Logo from "../../assets/icons/Logo";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import CornerBrackets from "../military/CornerBrackets";

// The candidate's path through the programme, drawn as a flight route with
// one waypoint per stage. A drone flies the route and each stage lights up
// as it is reached.
const STAGES = [
  { title: "Qeydiyyat", text: "Onlayn müraciət formasının doldurulması" },
  { title: "Seçim", text: "Müraciətin qiymətləndirilməsi və təsdiqi" },
  { title: "Nəzəri təlim", text: "Video dərslər, sənədlər və testlər" },
  { title: "Simulyator", text: "Realistik mühitlərdə uçuş missiyaları" },
  { title: "Yekun qiymətləndirmə", text: "Nəticələrin və reytinqin müəyyən edilməsi" },
];

const ROW = 76; // px height of one stage row
const RAIL = 64; // px width of the route column
const HEIGHT = ROW * STAGES.length;
const FLIGHT_MS = 10000;

const POINTS = STAGES.map((_, i) => [i % 2 ? 42 : 22, ROW / 2 + i * ROW]);
const ROUTE = POINTS.reduce((d, [x, y], i) => {
  if (i === 0) return `M${x} ${y}`;
  const [px, py] = POINTS[i - 1];
  return `${d} C${px} ${py + ROW / 2} ${x} ${y - ROW / 2} ${x} ${y}`;
}, "");
const [LAST_X, LAST_Y] = POINTS[POINTS.length - 1];

const prefersReducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    return false;
  }
};

// Stage the drone is currently flying over. Reads the SVG's own animation
// clock so the highlight stays in step with the SMIL flight.
const useFlightStage = (svgRef, enabled) => {
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!enabled) return undefined;
    const started = performance.now();
    const timer = setInterval(() => {
      const svg = svgRef.current;
      const elapsed =
        svg && typeof svg.getCurrentTime === "function"
          ? svg.getCurrentTime() * 1000
          : performance.now() - started;
      const t = (elapsed % FLIGHT_MS) / FLIGHT_MS;
      // The route segments are equal, so waypoint i is reached at t = i / (n - 1).
      setStage(Math.min(STAGES.length - 1, Math.floor(t * (STAGES.length - 1) + 0.12)));
    }, 120);
    return () => clearInterval(timer);
  }, [svgRef, enabled]);

  return stage;
};

const TrainingRoute = () => {
  const svgRef = useRef(null);
  const [animated] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(null);
  const flightStage = useFlightStage(svgRef, animated);
  const active = hovered ?? flightStage;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        mx: "auto",
        border: `1px solid ${C.lineDarkStrong}`,
        bgcolor: "rgba(38, 54, 35, 0.45)",
        animation: `sg-scale-in 1s ${EASE.out} .2s backwards`,
      }}
    >
      <CornerBrackets size={22} inset={-9} />

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${C.lineDark}`,
          fontFamily: FONT.mono,
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
        }}
      >
        <Box component="span" sx={{ color: C.brass }}>
          HAZIRLIQ MARŞRUTU
        </Box>
        <Box component="span" sx={{ color: C.textOnDarkMuted }}>
          {STAGES.length} MƏRHƏLƏ
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${RAIL}px 1fr`,
          px: 1.5,
          py: 1,
        }}
      >
        <svg
          ref={svgRef}
          width={RAIL}
          height={HEIGHT}
          viewBox={`0 0 ${RAIL} ${HEIGHT}`}
          aria-hidden="true"
        >
          {/* Planned route */}
          <path
            d={ROUTE}
            fill="none"
            stroke="rgba(201, 166, 70, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <line
            x1={LAST_X}
            y1={LAST_Y}
            x2={LAST_X}
            y2={HEIGHT}
            stroke="rgba(201, 166, 70, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          {/* Route drawn in on load */}
          <path
            d={ROUTE}
            fill="none"
            stroke={C.brass}
            strokeWidth="1.5"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            style={{ animation: `sg-dash 1.6s ${EASE.inOut} .6s forwards` }}
          />

          {/* Waypoints */}
          {POINTS.map(([x, y], i) => {
            const lit = i <= active;
            const current = i === active;
            return (
              <g key={i} style={{ transition: "opacity .3s" }}>
                <circle
                  cx={x}
                  cy={y}
                  r={current ? 11 : 9}
                  fill="none"
                  stroke={C.brass}
                  strokeOpacity={current ? 0.8 : 0.3}
                  style={{ transition: "r .3s, stroke-opacity .3s" }}
                />
                <rect
                  x={x - 4.5}
                  y={y - 4.5}
                  width="9"
                  height="9"
                  transform={`rotate(45 ${x} ${y})`}
                  fill={lit ? C.brass : C.field900}
                  stroke={C.brass}
                  strokeWidth="1.5"
                  style={{ transition: "fill .3s" }}
                />
              </g>
            );
          })}

          {/* Drone flying the route */}
          {animated && (
            <g>
              <animateMotion
                dur={`${FLIGHT_MS}ms`}
                repeatCount="indefinite"
                rotate="auto"
                path={ROUTE}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.05;0.95;1"
                dur={`${FLIGHT_MS}ms`}
                repeatCount="indefinite"
              />
              <circle r="11" fill="rgba(201, 166, 70, 0.14)" />
              <g stroke={C.brassLight} strokeWidth="1.4" strokeLinecap="round">
                <line x1="-5" y1="-5" x2="5" y2="5" />
                <line x1="5" y1="-5" x2="-5" y2="5" />
              </g>
              {[
                [-5, -5],
                [5, -5],
                [-5, 5],
                [5, 5],
              ].map(([cx, cy]) => (
                <circle
                  key={`${cx}${cy}`}
                  cx={cx}
                  cy={cy}
                  r="2.7"
                  fill={C.field900}
                  stroke={C.brassLight}
                  strokeWidth="1.2"
                />
              ))}
              <rect x="-1.8" y="-1.8" width="3.6" height="3.6" fill={C.brassLight} />
            </g>
          )}
        </svg>

        <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {STAGES.map((stage, i) => {
            const current = i === active;
            return (
              <Box
                component="li"
                key={stage.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  height: ROW,
                  display: "flex",
                  alignItems: "center",
                  pl: 1,
                  borderBottom:
                    i < STAGES.length - 1 ? `1px dashed ${C.lineDark}` : "none",
                  animation: `sg-fade-up .6s ${EASE.out} ${500 + i * 110}ms backwards`,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1.25} alignItems="baseline">
                    <Box
                      component="span"
                      sx={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.brass }}
                    >
                      {i + 1}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        ...labelCaps,
                        fontSize: "0.98rem",
                        color: current ? C.brassLight : C.textOnDark,
                        transition: "color .3s",
                      }}
                    >
                      {stage.title}
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      fontSize: "0.82rem",
                      lineHeight: 1.4,
                      color: C.textOnDarkMuted,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {stage.text}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 2.5,
          py: 1.75,
          borderTop: `1px solid ${C.lineDark}`,
          bgcolor: "rgba(201, 166, 70, 0.06)",
        }}
      >
        <Logo size={36} />
        <Box>
          <Box sx={{ ...labelCaps, fontSize: "0.66rem", color: C.textOnDarkMuted }}>
            Hədəf
          </Box>
          <Box sx={{ ...labelCaps, fontSize: "1rem", color: C.textOnDark }}>
            Hazır PUA operatoru
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default TrainingRoute;
