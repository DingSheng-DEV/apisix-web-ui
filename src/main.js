import { createApp } from "vue";
import App from "./App.vue";
import router from "@/route/index.js";
// 引入 Element Plus 的样式
import "element-plus/dist/index.css";
// 引入自定义样式
import "./style.css";
// 引入 Element Plus 语言包
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import { ElConfigProvider } from "element-plus";
// 引入 Element Plus 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入配置初始化
import { initConfig } from "@/utils/config.js";
// 引入 i18n
import i18n from "@/i18n/index.js";

// 初始化配置
initConfig();

const app = createApp(App);

app.use(router);
app.use(i18n);

// 全局注册 ElConfigProvider 组件
app.component("ElConfigProvider", ElConfigProvider);

// 全局注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 动态设置 Element Plus 语言包
const elementLocales = {
  'zh-CN': zhCn,
  'en': en
};

// 提供 Element Plus 语言包
app.provide("ELEMENT_LOCALE", elementLocales[i18n.global.locale.value] || zhCn);
app.provide("ELEMENT_LOCALES", elementLocales);

app.mount("#app");
