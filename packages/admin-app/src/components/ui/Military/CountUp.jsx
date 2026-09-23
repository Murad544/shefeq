import { useEffect, useRef, useState } from "react";

const reducedMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    return false;
  }
};

// Rolls a number up to `value` (and re-animates from the current value on change).
const CountUp = ({ value = 0, duration = 1100, decimals = 0, pad = 0, prefix = "", suffix = "" }) => {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [display, setDisplay] = useState(() => (reducedMotion() ? target : 0));
  const current = useRef(display);

  useEffect(() => {
    if (reducedMotion()) {
      current.current = target;
      setDisplay(target);
      return undefined;
    }
    const from = current.current;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      current.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  const text = decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {pad ? text.padStart(pad, "0") : text}
      {suffix}
    </span>
  );
};

export default CountUp;
