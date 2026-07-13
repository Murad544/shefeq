const { app, BrowserWindow } = require("electron");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 1200,
    title: process.env.REACT_APP_PROJECT_NAME
      ? `${process.env.REACT_APP_PROJECT_NAME}`
      : "Şəfəq Admin Panel",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
