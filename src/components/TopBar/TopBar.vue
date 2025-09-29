<script setup>
import { ref, computed } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElInput, ElAvatar, ElIcon, ElSelect, ElOption, ElMessage } from 'element-plus';
import { Search, Setting, User, SwitchButton } from '@element-plus/icons-vue';
import SettingsDialog from '@/components/Settings/SettingsDialog.vue';
import { useI18nUtils } from '@/utils/i18n.js';

const { t, switchLanguage, getCurrentLocale } = useI18nUtils();

// 设置对话框可见性
const settingsVisible = ref(false);

// 打开设置对话框
const openSettings = () => {
  settingsVisible.value = true;
};

// 设置保存后的回调
const onSettingsSaved = (newConfig) => {
  console.log('Settings saved:', newConfig);
  // 这里可以添加刷新页面或其他操作
};

// User information - 使用computed属性
const userName = computed(() => t('common.admin'))
const userRole = computed(() => t('common.systemAdmin'))
const userAvatar = ref('')

// Search functionality
const searchQuery = ref('');
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value);
};

// 语言选项
const languageOptions = ref([
  {
    value: 'zh-CN',
    label: '简体中文'
  },
  {
    value: 'en', 
    label: 'English'
  }
]);

// 当前语言
const currentLanguage = ref(getCurrentLocale());

// 处理语言切换
const handleLanguageChange = (newLanguage) => {
  switchLanguage(newLanguage);
  ElMessage({
    type: 'success',
    message: t('settings.languageChanged') || '语言切换成功'
  });
};

// Dropdown handlers
const handleCommand = (command) => {
  console.log('Command:', command);
  if (command === 'settings') {
    openSettings();
  } else if (command === 'logout') {
    console.log('Logging out...');
    // Add logout logic here
  }
};
</script>

<template>
  <div class="top-bar">
    <div class="left-section">
      <h1 class="app-title">{{ t('common.appTitle') }}</h1>
    </div>

    <div class="right-section">
      <!-- 语言切换下拉框 -->
      <div class="language-selector">
        <el-select 
          v-model="currentLanguage" 
          @change="handleLanguageChange" 
          style="width: 120px"
          size="small"
        >
          <el-option
            v-for="option in languageOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <div class="user-profile">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="user-info">
            <el-avatar :size="36" :src="userAvatar" class="user-avatar">
              {{ userName.charAt(0) }}
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                {{ t('nav.settings') }}
              </el-dropdown-item>
              <!-- <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                {{ t('nav.logout') }}
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 设置对话框 -->
    <SettingsDialog v-model:visible="settingsVisible" @saved="onSettingsSaved" />
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-selector {
  display: flex;
  align-items: center;
}


.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-info:hover {
  background: #f5f5f5;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.user-role {
  font-size: 12px;
  color: #909399;
}

.app-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}
</style>
