<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput, ElMenuItem, ElMenu, ElSubMenu, ElMenuItemGroup } from "element-plus";
import { ref, onMounted, inject, reactive, watch, computed } from "vue";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
import { useI18nUtils } from '@/utils/i18n.js';

let apiType = inject('apiType');
import { useRouter } from "vue-router";
const route = useRouter();
const { t } = useI18nUtils();

const changeType = (index) => {
  // 根据 index 找到对应的菜单项
  const clickedItem = menuItems.value
    .flatMap(group => group.children);
  for (let item of clickedItem) {
    if (index.index === item.index) {
      apiType.value = item.labelKey;
      route.push(`/${item.index}`);
    }
  }
};

const activeIndex = ref('') // 当前激活的菜单index

// 使用计算属性实现响应式的菜单项
const menuItems = computed(() => [
  {
    title: t('nav.resourceConfig'),
    children: [
      { index: 'Router', labelKey: 'nav.routes', label: t('nav.routes') },
      { index: 'Service', labelKey: 'nav.services', label: t('nav.services') },
      { index: 'Upstream', labelKey: 'nav.upstreams', label: t('nav.upstreams') },
    ],
  },
  {
    title: t('nav.globalConfig'),
    children: [
      { index: 'SSL', labelKey: 'nav.ssl', label: t('nav.ssl') },
      { index: 'global_rules', labelKey: 'nav.globalRules', label: t('nav.globalRules') },
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