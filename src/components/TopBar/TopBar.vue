<script setup>
import { ref } from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElBadge, ElInput, ElAvatar } from 'element-plus';
import { Search, Bell, Message, Setting } from '@element-plus/icons-vue';

// User information
const user = ref({
  name: 'Admin User',
  avatar: '',
  role: 'Administrator'
});

// Notifications count
const notificationCount = ref(5);
const messageCount = ref(3);

// Search functionality
const searchQuery = ref('');
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value);
};

// Dropdown handlers
const handleCommand = (command) => {
  console.log('Command:', command);
  if (command === 'logout') {
    console.log('Logging out...');
    // Add logout logic here
  }
};
</script>

<template>
  <div class="top-bar">
    <div class="left-section">
      <div class="logo">
        <h2>Admin System</h2>
      </div>
      <div class="nav-menu">
        <ul>
          <li class="active">Dashboard</li>
          <li>Users</li>
          <li>Settings</li>
          <li>Reports</li>
        </ul>
      </div>
    </div>
    
    <div class="right-section">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="Search..."
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
      </div>
      
      <div class="notification-area">
        <el-badge :value="notificationCount" class="notification-badge">
          <el-dropdown trigger="click">
            <span class="notification-icon">
              <el-icon><Bell /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Notification 1</el-dropdown-item>
                <el-dropdown-item>Notification 2</el-dropdown-item>
                <el-dropdown-item>View All Notifications</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-badge>
        
        <el-badge :value="messageCount" class="message-badge">
          <el-dropdown trigger="click">
            <span class="message-icon">
              <el-icon><Message /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Message 1</el-dropdown-item>
                <el-dropdown-item>Message 2</el-dropdown-item>
                <el-dropdown-item>View All Messages</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-badge>
      </div>
      
      <div class="user-profile">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="user.avatar">{{ user.name.charAt(0) }}</el-avatar>
            <span class="username">{{ user.name }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">Profile</el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon> Settings
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1000;
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 40px;
}

.logo h2 {
  margin: 0;
  color: #409EFF;
  font-size: 1.5rem;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin-right: 20px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;
  height: 60px;
  line-height: 60px;
  transition: all 0.3s;
}

.nav-menu li:hover {
  color: #409EFF;
}

.nav-menu li.active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.right-section {
  display: flex;
  align-items: center;
}

.search-box {
  margin-right: 20px;
  width: 200px;
}

.notification-area {
  display: flex;
  margin-right: 20px;
}

.notification-badge,
.message-badge {
  margin-right: 15px;
  cursor: pointer;
}

.notification-icon,
.message-icon {
  font-size: 20px;
  color: #606266;
}

.user-profile {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}
</style>
