<template>
  <div id="app">
    <el-config-provider :locale="currentElementLocale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const { locale } = useI18n()

// Element Plus 语言包映射
const elementLocales = {
  'zh-CN': zhCn,
  'en': en
}

// 当前 Element Plus 语言包
const currentElementLocale = ref(elementLocales[locale.value] || zhCn)

// 监听语言变更事件
const handleLocaleChange = (event) => {
  const newLocale = event.detail.locale
  currentElementLocale.value = elementLocales[newLocale] || zhCn
}

// 监听 i18n locale 变化
watch(locale, (newLocale) => {
  currentElementLocale.value = elementLocales[newLocale] || zhCn
})

onMounted(() => {
  // 监听来自 LanguageSwitcher 组件的语言变更事件
  window.addEventListener('locale-change', handleLocaleChange)
})

onUnmounted(() => {
  window.removeEventListener('locale-change', handleLocaleChange)
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #fafafa;
}
</style>