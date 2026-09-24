// Design tokens for the "command dossier" visual language.
// Soft olive field surfaces, brass insignia accents and official paper panels.

export const C = {
  // Field surfaces
  ink: "#0B0F0A",
  night: "#263623",
  field900: "#32432F",
  field800: "#3B4D37",
  field700: "#465B40",
  field600: "#506949",
  lineDark: "rgba(232, 228, 212, 0.22)",
  lineDarkStrong: "rgba(232, 228, 212, 0.4)",

  // Army olive drab (primary)
  olive: "#4B5320",
  oliveLight: "#6B7536",
  oliveDark: "#343A16",

  // Insignia brass (accent)
  brass: "#C9A646",
  brassLight: "#E0C675",
  brassDark: "#8F7424",

  // Official paper (light) surfaces
  paper: "#F3F0E6",
  paperRaised: "#FBFAF5",
  paperSunk: "#E9E4D4",
  rule: "#D6CFB8",
  ruleStrong: "#B5AC8F",

  // Text
  text: "#1C2117",
  textMuted: "#5C6152",
  textFaint: "#8A8D7C",
  textOnDark: "#E8E4D4",
  textOnDarkMuted: "#C7CFBC",

  // Signals
  red: "#A8322A",
  redLight: "#C8554C",
  green: "#3E7B3A",
  greenLight: "#5E9C58",
  amber: "#C08A1E",
  blue: "#2F6F8F",

  // Flag of Azerbaijan
  flagBlue: "#00B5E2",
  flagRed: "#EF3340",
  flagGreen: "#509E2F",
};

export const FONT = {
  display: "'Barlow Condensed', 'Oswald', 'Arial Narrow', sans-serif",
  serif:
    "'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif",
  body: "'IBM Plex Sans', 'Segoe UI', Roboto, Arial, sans-serif",
  mono: "'IBM Plex Mono', 'JetBrains Mono', Consolas, 'Courier New', monospace",
};

export const EASE = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
};

// Uppercase label style shared by nav items, table heads and field labels.
export const labelCaps = {
  fontFamily: FONT.display,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

// Map grid: fine 24px cells with stronger 120px major lines.
export const gridBackground = (color = C.lineDark, major = C.lineDark) => ({
  backgroundImage: [
    `linear-gradient(${major} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${major} 1px, transparent 1px)`,
    `linear-gradient(${color} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  ].join(","),
  backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
});

// Topographic contour lines, generated once as an SVG data URI.
const smoothClosedPath = (pts) => {
  const n = pts.length;
  const p = (i) => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
};

const contourRing = (cx, cy, r, seed, amp) => {
  const pts = [];
  const steps = 48;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const k =
      1 +
      amp *
        (Math.sin(a * 3 + seed) * 0.5 +
          Math.sin(a * 5 + seed * 1.7) * 0.3 +
          Math.sin(a * 2 - seed * 0.6) * 0.2);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * 0.78]);
  }
  return smoothClosedPath(pts);
};

export const topoDataUri = (stroke = "#C9A646", opacity = 0.18) => {
  const paths = [];
  const hills = [
    { cx: 260, cy: 230, seed: 1.3, rings: 11 },
    { cx: 960, cy: 600, seed: 4.1, rings: 13 },
    { cx: 1080, cy: 120, seed: 2.7, rings: 6 },
  ];
  hills.forEach(({ cx, cy, seed, rings }) => {
    for (let i = 1; i <= rings; i++) {
      const r = 18 + i * 24;
      paths.push(contourRing(cx, cy, r, seed + i * 0.35, 0.05 + i * 0.012));
    }
  });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='800' viewBox='0 0 1280 800'><g fill='none' stroke='${stroke}' stroke-opacity='${opacity}' stroke-width='1'>${paths
    .map((d) => `<path d='${d}'/>`)
    .join("")}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
