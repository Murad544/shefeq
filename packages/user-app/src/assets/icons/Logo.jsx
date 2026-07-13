const Logo = ({
  size = 64,
  title = "semadaki-gozler",
  variant = "default",
}) => {
  // Theme color variants
  const colorVariants = {
    default: {
      primary: "#364F6B",
      secondary: "#3FC1C9",
      accent: "#FC5185",
      light: "#F5F5F5",
      white: "#FFFFFF",
    },
    light: {
      primary: "#5A7298",
      secondary: "#6DD4DB",
      accent: "#FD789D",
      light: "#F9FAFB",
      white: "#FFFFFF",
    },
    dark: {
      primary: "#243348",
      secondary: "#2B878D",
      accent: "#E0385D",
      light: "#E5E7EB",
      white: "#F3F4F6",
    },
  };

  const colors = colorVariants[variant] || colorVariants.default;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={title}
      style={{
        filter: "drop-shadow(0 2px 8px rgba(54, 79, 107, 0.15))",
        transition: "all 0.3s ease",
      }}
    >
      <title>{title}</title>

      <defs>
        {/* Modern gradient using theme colors */}
        <linearGradient id="modernGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>

        {/* Secondary gradient for depth */}
        <linearGradient id="secondaryGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.primary} />
        </linearGradient>

        {/* Subtle radial gradient for highlights */}
        <radialGradient id="highlightGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor={colors.white} stopOpacity="0.3" />
          <stop offset="70%" stopColor={colors.white} stopOpacity="0.1" />
          <stop offset="100%" stopColor={colors.white} stopOpacity="0" />
        </radialGradient>

        {/* Professional glow effect */}
        <filter
          id="professionalGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Modern shadow */}
        <filter id="modernShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor={colors.primary}
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      {/* Cross arms with modern styling */}
      <g
        stroke={colors.secondary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#modernShadow)"
      >
        <line x1="18" y1="18" x2="62" y2="62" />
        <line x1="62" y1="18" x2="18" y2="62" />
      </g>

      {/* Central circle/head instead of shield */}
      <g filter="url(#professionalGlow)">
        <circle cx="40" cy="40" r="16" fill="url(#modernGradient)" />

        {/* Highlight overlay */}
        <circle cx="40" cy="40" r="16" fill="url(#highlightGrad)" />

        {/* Subtle border */}
        <circle
          cx="40"
          cy="40"
          r="16"
          fill="none"
          stroke={colors.light}
          strokeOpacity="0.6"
          strokeWidth="1"
        />
      </g>

      {/* Strict attacking eyebrows */}
      <g
        stroke={colors.primary}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#modernShadow)"
      >
        {/* Left eyebrow - angled downward toward center for aggressive look */}
        <line x1="30" y1="32" x2="38" y2="36" />
        {/* Right eyebrow - angled downward toward center for aggressive look */}
        <line x1="42" y1="36" x2="50" y2="32" />
      </g>

      {/* Modern rotor groups */}
      {[
        { cx: 18, cy: 18 },
        { cx: 62, cy: 18 },
        { cx: 18, cy: 62 },
        { cx: 62, cy: 62 },
      ].map(({ cx, cy }, i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          {/* Outer ring with gradient */}
          <circle
            r="10"
            fill="none"
            stroke="url(#secondaryGradient)"
            strokeWidth="2.5"
            opacity="0.8"
            filter="url(#modernShadow)"
          />

          {/* Inner highlight */}
          <circle r="10" fill="url(#highlightGrad)" opacity="0.4" />

          {/* Rotor blades with modern styling */}
          <g
            stroke={colors.light}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          >
            <line x1="-7" y1="0" x2="7" y2="0" />
            <line x1="0" y1="-7" x2="0" y2="7" />
          </g>

          {/* Center hub with accent color */}
          <circle r="2.5" fill={colors.accent} opacity="0.8" />

          {/* Hub highlight */}
          <circle r="2.5" fill={colors.white} opacity="0.3" />
        </g>
      ))}

      {/* Subtle outer glow */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="none"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.1"
      />
    </svg>
  );
};

export default Logo;
