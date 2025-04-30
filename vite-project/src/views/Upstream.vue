<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import result from '@/components/main/result.vue';
import { ref, reactive, provide } from "vue";
import resBody from "@/components/resBody/resBody.vue";
import { Search } from '@element-plus/icons-vue'
import UpstreamBody from "@/components/resBody/UpstreamBody.vue";
let type = ref(-1);
let dialogVisible = ref(false)
let formBody = reactive({

})
let formData = ref({

})


const onBeforeSubmit = (index) => {
    dialogVisible.value = true
    // formBody = []
    // formData = RouteReflect[index]
    // if (RouteReflect[index].body) {
    //   let { body, ...parms } = RouteReflect[index]
    //   formBody = JSON.parse(JSON.stringify(RouteReflect[index].body));
    //   formData = JSON.parse(JSON.stringify(parms));
    // }
    // dialogVisible.value = true
    // type.value = index



}

const onSubmit = () => {
    dialogVisible.value = false
}

</script>

<template>
    <div>
        <div style="display: flex; flex-direction: column; width: 100%;">
            <el-card style="width: 100%;height: 80px;">
                <div style="display: flex;">
                    <el-input v-model="input3" placeholder="根据id获取资源" class="input-with-select"
                        style="width: 25%;margin-right: 6px;">
                        <template #prepend>
                            <el-button :icon="Search" />
                        </template>
                    </el-input>
                    <el-button type="primary" @click="onBeforeSubmit(index)">创建资源</el-button>
                </div>
                <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item v-for="(item, index) in RouteReflect">
              <el-button type="primary" @click="onBeforeSubmit(index)"> {{ item.desc }}</el-button>
            </el-form-item>
          </el-form> -->
            </el-card>
            <el-card style="margin-top: 10px;overflow: auto;">
                <result></result>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="Parms" :before-close="handleClose">
            <UpstreamBody></UpstreamBody>
        </el-dialog>
    </div>
</template>

<style scoped></style>