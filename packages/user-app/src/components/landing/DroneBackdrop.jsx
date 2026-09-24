import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";
import { C } from "../../config/tokens";

const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
  50% { transform: translate3d(0, -13px, 0) rotate(-1deg); }
`;

const rotors = [
  [105, 93],
  [335, 93],
  [64, 223],
  [376, 223],
];

// Small perspective drone that reads as part of the hero backdrop.
const DroneBackdrop = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: "absolute",
      width: { xs: 330, md: 420 },
      left: { xs: -125, md: -115 },
      top: "45%",
      transform: "translateY(-50%)",
      opacity: { xs: 0.2, md: 0.27 },
      pointerEvents: "none",
    }}
  >
    <Box
      component="svg"
      viewBox="0 0 440 340"
      sx={{
        width: "100%",
        display: "block",
        filter: "drop-shadow(0 18px 14px rgba(0, 0, 0, .4))",
        animation: `${float} 6s ease-in-out infinite`,
      }}
    >
      <defs>
        <linearGradient id="backdrop-drone-shell" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8B9774" />
          <stop offset=".55" stopColor="#4D5B43" />
          <stop offset="1" stopColor="#263427" />
        </linearGradient>
        <linearGradient id="backdrop-drone-blade" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#B0BAA0" />
          <stop offset="1" stopColor="#56644F" />
        </linearGradient>
      </defs>

      {/* Rear and front arms converge on the raised body. */}
      <g fill="#45533F" stroke="#9CA989" strokeWidth="2">
        <path d="M196 163 101 91l-13 14 98 91Z M244 163l95-72 13 14-98 91Z" />
        <path d="M190 190 59 216l4 18 139-21Z M250 190l131 26-4 18-139-21Z" />
      </g>
      <path d="M174 175 91 108 M266 175l83-67 M174 207 74 223 M266 207l100 16" fill="none" stroke="#263627" strokeWidth="3" strokeLinecap="round" />

      {rotors.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <path d="M-16 4v11q16 10 32 0V4" fill="#1B271F" stroke="#7F8D70" strokeWidth="2" />
          <ellipse cy="4" rx="16" ry="8" fill="#344333" stroke="#A0AD91" strokeWidth="2" />
          <ellipse rx="49" ry="15" fill="none" stroke={C.brassLight} strokeOpacity=".3" strokeWidth="1.5" />
          <path d="M-5-2C-21-12-40-13-48-7c-2 7 20 12 44 10ZM5 2C21 12 40 13 48 7c2-7-20-12-44-10Z" fill="url(#backdrop-drone-blade)" stroke="#C1C8AF" strokeWidth="1" />
          <ellipse rx="10" ry="6" fill="#243223" stroke={C.brassLight} strokeWidth="1.5" />
          <circle r="2" fill="#D6DBBE" />
        </g>
      ))}

      {/* Faceted canopy and camera create the three-dimensional profile. */}
      <path d="M180 156 220 139 260 156 275 210 246 242h-52l-29-32Z" fill="#19251B" stroke={C.brass} strokeWidth="2" />
      <path d="M181 156 220 145 259 156 267 203 244 225h-48l-23-22Z" fill="url(#backdrop-drone-shell)" stroke="#B3BC9A" strokeWidth="2" />
      <path d="M181 156 220 145 259 156 242 177h-44Z" fill="#AAB495" opacity=".65" />
      <path d="M198 177h44l-6 33h-32Z" fill="#2B392C" stroke="#738264" strokeWidth="1.5" />
      <path d="M207 183h26 M210 190h20" stroke="#9EAA8B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="185" cy="198" r="2" fill={C.brassLight} />
      <circle cx="255" cy="198" r="2" fill={C.brassLight} />
      <path d="M173 203 196 225h48l23-22-8 28-15 16h-48l-15-16Z" fill="#263427" stroke="#8E9C7E" strokeWidth="2" />
      <path d="M195 244 183 266h28 M245 244l12 22h-28" fill="none" stroke="#899878" strokeWidth="4" strokeLinecap="round" />
      <path d="M203 228h34l-5 23h-24Z" fill="#121B16" stroke={C.brass} strokeWidth="2" />
      <ellipse cx="220" cy="244" rx="10" ry="8" fill="#0B1311" stroke={C.brassLight} strokeWidth="2" />
      <circle cx="220" cy="244" r="5" fill="#294C60" />
      <circle cx="218" cy="242" r="1.5" fill="#C2D7D3" />
    </Box>
  </Box>
);

export default DroneBackdrop;
