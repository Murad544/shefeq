import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import theme from "./styles/theme";
import BootSequence from "./components/ui/Military/BootSequence";
import { BRAND } from "./config/brand";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BootSequence
      storageKey="sg_admin_boot_done"
      subtitle={`${BRAND.PROJECT_DESCRIPTOR} · ${BRAND.ADMIN_NAME}`}
      tag={`${BRAND.PROJECT_NAME} // ${BRAND.ADMIN_NAME}`.toLocaleUpperCase("az")}
      lines={["SİSTEM İŞƏ SALINIR", "İDARƏETMƏ MODULU YÜKLƏNİR", "İNTERFEYS HAZIRLANIR"]}
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
