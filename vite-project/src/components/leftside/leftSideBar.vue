<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput } from "element-plus";
import { ref } from "vue";
import Http from "@/utils/request.js";
let resouseActive = ref("");
let globalActive = ref("");

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
        <el-select v-model="resouseActive" class="m-2" placeholder="资源配置">
          <el-option v-for="item in resouse" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-model="globalActive" class="m-2" placeholder="全局配置">
          <el-option v-for="item in global" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>
