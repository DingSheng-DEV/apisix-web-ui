<template>
  <el-dropdown @command="handleCommand" class="language-switcher">
    <span class="el-dropdown-link">
      <span class="language-icon">🌐</span>
      <span class="language-text">{{ currentLanguageName }}</span>
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          :class="{ 'is-active': locale === 'zh-CN' }" 
          command="zh-CN"
        >
          🇨🇳 简体中文
        </el-dropdown-item>
        <el-dropdown-item 
          :class="{ 'is-active': locale === 'en' }" 
          command="en"
        >
          🇺🇸 English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

const { locale } = useI18n()
const elementLocales = inject('ELEMENT_LOCALES')

// 计算当前语言显示名称
const currentLanguageName = computed(() => {
  return locale.value === 'zh-CN' ? '简体中文' : 'English'
})

// 语言选项
const languages = {
  'zh-CN': '简体中文',
  'en': 'English'
}

// 处理语言切换
const handleCommand = (command) => {
  if (command !== locale.value) {
    // 更新 vue-i18n 语言
    locale.value = command
    
    // 保存到本地存储
    localStorage.setItem('locale', command)
    
    // 更新 Element Plus 语言包
    if (elementLocales && elementLocales[command]) {
      // 这里需要通过事件或状态管理来更新 Element Plus 语言包
      // 可以通过 mitt 或 Pinia 来实现全局状态管理
      updateElementLocale(command)
    }
    
    // 可选：刷新页面以确保所有组件都使用新语言
    // window.location.reload()
  }
}

// 更新 Element Plus 语言包的函数
const updateElementLocale = (newLocale) => {
  // 发出自定义事件来通知 App.vue 更新 Element Plus 语言包
  window.dispatchEvent(new CustomEvent('locale-change', { 
    detail: { locale: newLocale } 
  }))
}
</script>

<style scoped>
.language-switcher {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.language-switcher:hover {
  background-color: var(--el-color-primary-light-9);
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.language-icon {
  font-size: 16px;
  margin-right: 4px;
}

.language-text {
  margin: 0 4px;
}

.el-dropdown-menu .is-active {
  color: var(--el-color-primary);
  font-weight: bold;
}

.el-dropdown-menu .is-active::before {
  content: '✓ ';
  font-weight: bold;
}
</style>
