<script setup>
import TopBar from './TopBar.vue';
import { ref } from 'vue';

// Demo content
const mainContent = ref('Main Content Area');
</script>

<template>
  <div class="admin-layout">
    <TopBar />
    
    <div class="main-container">
      <div class="sidebar">
        <!-- Sidebar content would go here -->
        <div class="sidebar-menu">
          <div class="menu-item active">
            <span>Dashboard</span>
          </div>
          <div class="menu-item">
            <span>Users</span>
          </div>
          <div class="menu-item">
            <span>Products</span>
          </div>
          <div class="menu-item">
            <span>Orders</span>
          </div>
          <div class="menu-item">
            <span>Settings</span>
          </div>
        </div>
      </div>
      
      <div class="content-area">
        <div class="content-header">
          <h2>Dashboard</h2>
          <div class="breadcrumb">Home / Dashboard</div>
        </div>
        
        <div class="content-body">
          {{ mainContent }}
          
          <!-- Demo cards -->
          <div class="card-container">
            <div class="card">
              <h3>Users</h3>
              <div class="card-value">1,254</div>
            </div>
            
            <div class="card">
              <h3>Revenue</h3>
              <div class="card-value">$45,290</div>
            </div>
            
            <div class="card">
              <h3>Orders</h3>
              <div class="card-value">845</div>
            </div>
            
            <div class="card">
              <h3>Products</h3>
              <div class="card-value">128</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background-color: #304156;
  color: #bfcbd9;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu {
  padding: 20px 0;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #263445;
  color: #fff;
}

.menu-item.active {
  background-color: #1890ff;
  color: #fff;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header h2 {
  margin: 0;
  color: #303133;
}

.breadcrumb {
  color: #909399;
  font-size: 14px;
}

.content-body {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h3 {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 16px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>
