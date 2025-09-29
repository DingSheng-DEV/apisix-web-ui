import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import en from './locales/en.js'

// 获取浏览器语言或本地存储的语言设置
function getDefaultLocale() {
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale) {
    return storedLocale
  }
  
  const browserLocale = navigator.language.toLowerCase()
  if (browserLocale.includes('zh')) {
    return 'zh-CN'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(), // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en': en
  }
})

export default i18n
