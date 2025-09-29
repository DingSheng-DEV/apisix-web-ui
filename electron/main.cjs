const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // 禁用安全策略（解决 CORS 问题）
    },
  });

  //   // 开发环境加载开发服务器
  //   if (process.env.NODE_ENV === "development") {
  //     win.loadURL("http://localhost:8080");
  //     win.webContents.openDevTools();
  //   } else {
  //     // 生产环境加载打包后的文件
  //     // win.loadFile(path.join(__dirname, "../dist/index.html"));
  //     // ✅ 正确方式：使用 loadFile 加载本地文件
  //     win.loadFile("dist/index.html");
  //   }
  win.loadFile("dist/index.html");
}                    

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
