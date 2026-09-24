import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { EASE } from "../../config/tokens";

const canObserve = () =>
  typeof window !== "undefined" && "IntersectionObserver" in window;

// Fades and lifts its children into place the first time they scroll into view.
const Reveal = ({ children, delay = 0, y = 18, threshold = 0.15, sx, ...rest }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => !canObserve());

  useEffect(() => {
    if (shown || !ref.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shown, threshold]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity .7s ${EASE.out} ${delay}ms, transform .8s ${EASE.out} ${delay}ms`,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Reveal;
