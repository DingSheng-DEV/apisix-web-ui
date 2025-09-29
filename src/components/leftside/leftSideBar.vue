<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput, ElMenuItem, ElMenu, ElSubMenu, ElMenuItemGroup } from "element-plus";
import { ref, onMounted, inject, reactive, watch } from "vue";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
let apiType = inject('apiType');
import { useRouter } from "vue-router";
const route = useRouter();
const changeType = (index) => {
  // 根据 index 找到对应的菜单项
  const clickedItem = menuItems
    .flatMap(group => group.children);
  for (let item of clickedItem) {
    if (index.index === item.index) {
      apiType.value = item.label;
      route.push(`/${item.index}`);
    }
  }
};

const activeIndex = ref('') // 当前激活的菜单index
const menuItems = reactive([
  {
    title: '资源配置',
    children: [
      { index: 'Router', label: '路由' },
      { index: 'Service', label: '服务' },
      { index: 'Upstream', label: '上游' },
    ],
  },
  {
    title: '全局配置',
    children: [
      { index: 'SSL', label: 'SSL证书' },
      { index: 'global_rules', label: '全局规则' },
    ],
  },
]);
onMounted(() => {
  let localHash = window.location.pathname.split('/')[1];
  activeIndex.value = localHash;
});
</script>

<template>
  <div class="sidebar-container">
    <el-menu :default-active="activeIndex" router class="sidebar-menu" mode="vertical">
      <el-sub-menu v-for="group in menuItems" :key="group.title" :index="group.children[0].index.split('-')[0]">
        <template #title>
          <span class="menu-group-title">{{ group.title }}</span>
        </template>
        <el-menu-item v-for="item in group.children" :key="item.index" :index="item.index" class="menu-item">
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 240px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;
}
</style>