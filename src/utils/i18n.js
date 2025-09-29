import { useI18n } from 'vue-i18n'

/**
 * i18n 工具函数
 */
export function useI18nUtils() {
  const { t, locale } = useI18n()

  /**
   * 切换语言
   * @param {string} newLocale - 新的语言代码
   */
  const switchLanguage = (newLocale) => {
    if (newLocale !== locale.value) {
      locale.value = newLocale
      localStorage.setItem('locale', newLocale)
      
      // 发出语言变更事件
      window.dispatchEvent(new CustomEvent('locale-change', { 
        detail: { locale: newLocale } 
      }))
    }
  }

  /**
   * 获取当前语言
   */
  const getCurrentLocale = () => {
    return locale.value
  }

  /**
   * 判断是否为中文
   */
  const isZhCN = () => {
    return locale.value === 'zh-CN'
  }

  /**
   * 判断是否为英文
   */
  const isEn = () => {
    return locale.value === 'en'
  }

  /**
   * 获取语言显示名称
   */
  const getLanguageName = (localeCode = null) => {
    const targetLocale = localeCode || locale.value
    const names = {
      'zh-CN': '简体中文',
      'en': 'English'
    }
    return names[targetLocale] || names['zh-CN']
  }

  /**
   * 翻译文本（带参数插值）
   * @param {string} key - 翻译键
   * @param {Object} params - 参数对象
   */
  const translate = (key, params = {}) => {
    return t(key, params)
  }

  /**
   * 批量翻译
   * @param {Array} keys - 翻译键数组
   */
  const batchTranslate = (keys) => {
    return keys.reduce((result, key) => {
      result[key] = t(key)
      return result
    }, {})
  }

  return {
    t,
    locale,
    switchLanguage,
    getCurrentLocale,
    isZhCN,
    isEn,
    getLanguageName,
    translate,
    batchTranslate
  }
}
