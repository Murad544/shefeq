import crestSrc from "./mmu-3d.png";

// Milli Müdafiə Universiteti crest. `size` is the rendered height in px (or a
// CSS length such as "100%"); the width follows the crest's proportions.
const CREST_RATIO = 501 / 640;

const Logo = ({ size = 64, title = "Milli Müdafiə Universitetinin gerbi" }) => {
  const fixed = typeof size === "number";

  return (
    <img
      src={crestSrc}
      alt={title}
      width={fixed ? Math.round(size * CREST_RATIO) : undefined}
      height={fixed ? size : undefined}
      draggable={false}
      style={{
        display: "block",
        flexShrink: 0,
        height: size,
        width: fixed ? Math.round(size * CREST_RATIO) : "auto",
        maxWidth: "100%",
        margin: fixed ? undefined : "0 auto",
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  );
};

export default Logo;
