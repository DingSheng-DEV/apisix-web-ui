<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElInput, ElRadio, ElRadioGroup } from "element-plus";
import { ref, inject, watch, onMounted } from "vue";
import RouterBody from "../../../public/RouterBody.js";
import ServiceBody from "../../../public/ServiceBody.js";
import UpstreamBody from "../../../public/UpstreamBody.js";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
// 新元素输入
let newItem = ref('');
let apiType = inject('apiType');
let bodyRequest = ref([])
let radio2 = ref(false)
watch(apiType, (newValue) => {
    switch (newValue) {
        case "Router":
            bodyRequest.value = RouterBody;
            break;
        case "Service":
            bodyRequest.value = ServiceBody;
            break;
        case "Upstream":
            bodyRequest.value = UpstreamBody;
            break;
        default:
            break;
    }
})
onMounted(() => {
    switch (apiType.value) {
        case "Router":
            bodyRequest.value = RouterBody;
            break;
        case "Service":
            bodyRequest.value = ServiceBody;
            break;
        case "Upstream":
            bodyRequest.value = UpstreamBody;
            break;
        default:
            break;
    }
    console.log(bodyRequest.value);

})
</script>

<template>

    <div>
        asds
        <div v-for="(item, index) in bodyRequest[0]"
            style="display: flex;gap: 6px;margin: 5px 0px;align-items: center;">
            {{ item }}{{ index }}
            <div v-if="Array.isArray(item)">
                <!-- 添加数据的输入框和按钮 -->
                <div style="display: flex;">
                    <el-input v-model="newItem" placeholder="请输入要添加的元素" class="input-item" />
                    <el-button type="primary" @click="addItem" class="add-button">
                        添加元素
                    </el-button>
                </div>
            </div>

            <div v-if="typeof item === 'string' || typeof item === 'number'">
                <!-- 添加数据的输入框和按钮 -->
                <div class="add-controls">
                    <el-input v-model="newItem" placeholder="请输入要添加的元素" class="input-item" />
                </div>
            </div>


            <div v-if="typeof item === 'boolean'">
                <!-- 添加数据的输入框和按钮 -->
                <div class="add-controls">
                    <el-radio-group v-model="radio2" class="ml-4">
                        <el-radio :label="false">false</el-radio>
                        <el-radio :label="true">true</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>