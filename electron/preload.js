// 预加载脚本
const { contextBridge, ipcRenderer } = require("electron");

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 获取版本信息
  getVersions: () => process.versions,

  // 其他可能需要的 API
  platform: process.platform,

  // IPC 通信（如果需要）
  sendMessage: (channel, data) => {
    // 白名单允许的频道
    const validChannels = ["message-from-renderer"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  onMessage: (channel, callback) => {
    const validChannels = ["message-from-main"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
});

// DOM 加载完成后的处理
window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload script loaded");

  // 检查 Vue 应用是否正确加载
  const checkVueApp = () => {
    const appElement = document.getElementById("app");
    if (appElement) {
      console.log("App element found:", appElement);

      // 检查 Vue 应用是否已经挂载
      setTimeout(() => {
        if (appElement.children.length === 0) {
          console.warn(
            "Vue app may not have loaded correctly - app div is empty"
          );
        } else {
          console.log("Vue app loaded successfully");
        }
      }, 2000);
    } else {
      console.error("App element not found");
    }
  };

  checkVueApp();
});

// 监听页面错误
window.addEventListener("error", (event) => {
  console.error("Page error:", event.error);
});

// 监听未处理的 Promise 拒绝
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
