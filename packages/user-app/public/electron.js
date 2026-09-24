const { app, BrowserWindow } = require("electron");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 1200,
    icon: path.join(__dirname, "favicon.png"),
    title: process.env.REACT_APP_PROJECT_NAME
      ? `${process.env.REACT_APP_PROJECT_NAME}`
      : "FPV Tədris Alt Sistemi",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:3001");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
