import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.3.125:9180", // 目标服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, "");
          console.log(`代理路径: ${path} => ${newPath}`);
          return newPath;
        },
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("代理请求:", req.url, "=>", proxyReq.path);
          });
        },
      },
    },
  },
});
