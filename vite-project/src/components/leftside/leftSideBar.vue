<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput, ElMenuItem, ElMenu, ElSubMenu, ElMenuItemGroup } from "element-plus";
import { ref, onMounted, inject, reactive } from "vue";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
let apiType = inject('apiType');
let resouseActive = ref("");
let globalActive = ref("");

const changeType = (index) => {
  // 根据 index 找到对应的菜单项
  const clickedItem = menuItems
    .flatMap(group => group.children)
  for (let item of clickedItem) {
    if (index.index === item.index) {
      apiType.value = item.label;
    }
  }
};
const resouse = [
  {
    value: "Router",
    label: "Router",
  },
  {
    value: "Service",
    label: "Service",
  },
  {
    value: "Upstream",
    label: "Upstream",
  },
]

const menuItems = reactive([
  {
    title: '资源配置',
    children: [
      { index: '1-1', label: 'Router' },
      { index: '1-2', label: 'Service' },
      { index: '1-3', label: 'Upstream' },
    ],
  },
  {
    title: '全局配置',
    children: [
      { index: '2-1', label: 'SSL' },
      { index: '2-2', label: '全局配置' },
    ],
  },
]);
const global = [
  {
    value: "Service",
    label: "Service",
  },
  {
    value: "SSL",
    label: "SSL",
  },
]

onMounted(() => {

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
        <el-menu default-active="2">
          <el-sub-menu v-for="group in menuItems" :key="group.title" :index="group.children[0].index.split('-')[0]">
            <template #title><span>{{ group.title }}</span></template>
            <el-menu-item v-for="item in group.children" :key="item.index" :index="item.index" @click="changeType">
              {{ item.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
        <!-- <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
          style="width: 100%;" @click="changeType()">
          <el-sub-menu index="1">
            <template #title>
              <span>资源配置</span>
            </template>
            <el-menu-item index="1-1">Router</el-menu-item>
            <el-menu-item index="1-2">Service</el-menu-item>
            <el-menu-item index="1-3">Upstream</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <span>全局配置</span>
            </template>
            <el-menu-item index="2-1">SSL</el-menu-item>
            <el-menu-item index="2-2">全局配置</el-menu-item>
          </el-sub-menu>
        </el-menu> -->
      </div>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-menu) {
  border: 0px
}
</style>