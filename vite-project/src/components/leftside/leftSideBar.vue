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
    .flatMap(group => group.children)
  for (let item of clickedItem) {
    if (index.index === item.index) {
      apiType.value = item.label;
      route.push(`/${item.label}`)
    }
  }
};

const activeIndex = ref('') // 当前激活的菜单index
const menuItems = reactive([
  {
    title: '资源配置',
    children: [
      { index: 'Router', label: 'Router' },
      { index: 'Service', label: 'Service' },
      { index: 'Upstream', label: 'Upstream' },
    ],
  },
  {
    title: '全局配置',
    children: [
      { index: 'SSL', label: 'SSL' },
      { index: 'global_rules', label: 'global_rules' },
    ],
  },
]);
onMounted(() => {
  let localHash = window.location.pathname.split('/')[1];

  activeIndex.value = localHash;
})



</script>

<template>
  <div>
    <el-card style="height: 100%;width: 12vw;margin-right: 10px;">
      <div style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
        ">
        <el-menu :default-active="activeIndex" router style="width: 100%;">
          <el-sub-menu v-for="group in menuItems" :key="group.title" :index="group.children[0].index.split('-')[0]">
            <template #title><span>{{ group.title }}</span></template>
            <el-menu-item v-for="item in group.children" :key="item.index" :index="item.index">
              {{ item.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-menu) {
  border: 0px
}
</style>