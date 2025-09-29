import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    server: {
    host: '0.0.0.0', // 关键：监听所有网络接口
    port: 8001,      // 可选：默认就是8080
    allowedHosts: 'all', // 可选：防止 host header 检查报错
    https: false,     // 可选：如果你有https需求再开
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9180", // 目标服务器地址
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
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: "assets/[name]-[hash].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
    },
  },
});
