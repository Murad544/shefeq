import { useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation, useNavigationType } from "react-router-dom";

// Fades each route in and resets scroll on forward navigation. Opacity only:
// a transform here would re-anchor position: fixed descendants.
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Back/forward and reloads keep the browser's own scroll restoration.
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  // Key on the top-level section so moving between e.g. /users/1/edit and
  // /users/2/edit doesn't remount the whole route tree.
  const section = pathname.split("/")[1] || "root";

  return (
    <Box key={section} sx={{ animation: "sg-fade-in .45s ease backwards" }}>
      {children}
    </Box>
  );
};

export default PageTransition;
