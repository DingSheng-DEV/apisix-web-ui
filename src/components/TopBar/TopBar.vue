<script setup>
import { ref } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElInput, ElAvatar, ElIcon } from 'element-plus';
import { Search, Setting, User, SwitchButton } from '@element-plus/icons-vue';
import SettingsDialog from '@/components/Settings/SettingsDialog.vue';

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

// User information
const user = ref({
  name: '管理员',
  avatar: '',
  role: '系统管理员'
});

// Search functionality
const searchQuery = ref('');
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value);
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
      <h1 class="app-title">APISIX 管理系统</h1>
    </div>

    <div class="right-section">
      <div class="user-profile">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="user-info">
            <el-avatar :size="36" :src="user.avatar" class="user-avatar">
              {{ user.name.charAt(0) }}
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ user.name }}</span>
              <span class="user-role">{{ user.role }}</span>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
}

.user-info:hover {
  background: #f5f5f5;
}

.app-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}
</style>
