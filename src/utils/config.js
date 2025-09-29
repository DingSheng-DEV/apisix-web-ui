import { reactive } from "vue";

// 创建响应式的配置对象
export const apiConfig = reactive({
  token: "edd1c9f034335f136f87ad84b625c8f1", // 默认token
  port: "9180", // 默认端口
  api: "127.0.0.1", // 默认API地址
});

// 更新配置的方法
export function updateConfig(newConfig) {
  if (newConfig.token) {
    apiConfig.token = newConfig.token;
  }
  if (newConfig.port) {
    apiConfig.port = newConfig.port;
  }
  if (newConfig.api) {
    apiConfig.api = newConfig.api;
  }

  // 这里可以添加保存到localStorage的逻辑，以便刷新页面后保持配置
  localStorage.setItem("apiConfig", JSON.stringify(apiConfig));

  return apiConfig;
}

// 初始化配置，从localStorage加载
export function initConfig() {
  const savedConfig = localStorage.getItem("apiConfig");
  if (savedConfig) {
    const parsedConfig = JSON.parse(savedConfig);
    updateConfig(parsedConfig);
  }
  return apiConfig;
}
