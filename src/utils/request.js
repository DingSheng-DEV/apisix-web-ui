// 引入 axios
import axios from "axios";
import { apiConfig } from "./config.js";

// 创建 axios 实例
const Http = axios.create({
  baseURL: '/api', // 使用Vite代理
  timeout: 15000, // 增加超时时间（毫秒）
  headers: {
    "Content-Type": "application/json", // 默认请求头
    "X-API-KEY": apiConfig.token,
  },
});

// 请求拦截器
Http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 每次请求都使用最新的token
    config.headers["X-API-KEY"] = apiConfig.token;
    
    // 在开发环境中使用代理，不修改baseURL
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("请求拦截器错误：", error);
    return Promise.reject(error);
  }
);

// // 响应拦截器
// Http.interceptors.response.use(
//   (response) => {
//     // 对响应数据做点什么
//     console.log('响应拦截器：', response);
//     return response.data; // 返回响应数据
//   },
//   (error) => {
//     // 对响应错误做点什么
//     console.error('响应拦截器错误：', error);
//     if (error.response) {
//       // 请求已发出，但服务器响应的状态码不在 2xx 范围内
//       console.error('响应状态码：', error.response.status);
//     } else if (error.request) {
//       // 请求已发出，但没有收到响应
//       console.error('请求未收到响应：', error.request);
//     } else {
//       // 在设置请求时发生了一些事情，触发了一个错误
//       console.error('请求设置错误：', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default Http;
