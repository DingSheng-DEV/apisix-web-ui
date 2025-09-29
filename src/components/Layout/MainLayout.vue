<template>
  <div class="admin-layout">
    <!-- 左侧菜单栏 -->
    <LeftSideBar />
    
    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <TopBar />
      
      <!-- 页面内容 -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftSideBar from '@/components/leftside/leftSideBar.vue';
import TopBar from '@/components/TopBar/TopBar.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .main-content {
    min-height: calc(100vh - 260px);
  }
}
</style>
