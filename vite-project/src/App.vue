<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput, ElForm, ElFormItem, ElEmpty, ElDialog } from "element-plus";
import { ref, reactive, provide } from "vue";
import Http from "@/utils/request.js";
import LeftSideBar from "@/components/leftside/leftSideBar.vue";
import TopBar from "@/components/TopBar/TopBar.vue";
import RouteReflect from "../public/RouteReflect.js";
import result from "./components/main/result.vue";
import { isFragment } from "element-plus/es/utils/index.mjs";
let apiType = ref('')
provide('apiType', apiType);
let type = ref(-1);
let dialogVisible = ref(false)
let formBody = reactive({

})
let formData = ref({

})


const onBeforeSubmit = (index) => {
  formBody = []
  formData = RouteReflect[index]
  if (RouteReflect[index].body) {
    let { body, ...parms } = RouteReflect[index]
    formBody = JSON.parse(JSON.stringify(RouteReflect[index].body));
    formData = JSON.parse(JSON.stringify(parms));
  }
  dialogVisible.value = true
  type.value = index
}

const onSubmit = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div>
    <TopBar style="margin-bottom: 10px;"></TopBar>
    <div style="display: flex;height:  calc(100vh - 150px)">
      <LeftSideBar></LeftSideBar>
      <div style="display: flex; flex-direction: column; width: 100%;">
        <el-card style="width: 100%;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item v-for="(item, index) in RouteReflect">
              <el-button type="primary" @click="onBeforeSubmit(index)"> {{ item.desc }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top: 10px;overflow: auto;">
          <result></result>
        </el-card>
      </div>
    </div>
  </div>


  <el-dialog v-model="dialogVisible" title="Parms" width="30%" :before-close="handleClose">
    <div v-for="(value, key) in formData" style="display: flex;gap: 6px;margin: 5px 0px;align-items: center;">
      <span style="width: 12%;text-align: center;">{{ key }}</span>
      <el-input style="width: 75%;" :value="value">{{ key }}</el-input>
    </div>
    <div>
      <span>body:</span>
    </div>
    <div v-for="(value, key) in formBody"
      style="display: flex;gap: 6px;margin: 5px 0px;align-items: center;justify-content: space-between;padding: 0 20px;">
      <span style="text-align: center;">{{ key }}:{{ value }}</span>
      <el-input style="width: 25%;"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          发送
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
