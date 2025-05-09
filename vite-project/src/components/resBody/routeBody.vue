<template>
    <div class="route-form-container">
        <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="路由名称" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入路由名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路由描述" prop="desc">
                            <el-input v-model="formData.desc" placeholder="请输入路由描述" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="启用WebSocket" prop="enable_websocket">
                    <el-switch v-model="formData.enable_websocket" />
                </el-form-item>
            </el-card>

            <!-- URI配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">URI配置</span>
                </template>

                <array-input v-model="formData.uris" label="URI列表（必填）" placeholder="例如: /api/test" />

                <array-input v-model="formData.methods" label="HTTP方法" placeholder="例如: GET" :options="httpMethods" />

                <array-input v-model="formData.hosts" label="Host列表" placeholder="例如: example.com" />

                <array-input v-model="formData.remote_addrs" label="远程地址" placeholder="例如: 192.168.1.1" />
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">上游服务配置(必填)</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="上游服务ID" prop="upstream_id">
                            <el-input v-model="formData.upstream_id" placeholder="请输入上游服务ID" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务ID" prop="service_id">
                            <el-input v-model="formData.service_id" placeholder="请输入服务ID" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="上游类型" prop="upstream.type">
                    <el-select v-model="formData.upstream.type" placeholder="请选择上游类型">
                        <el-option label="HTTP" value="http" />
                        <el-option label="HTTPS" value="https" />
                        <el-option label="GRPC" value="grpc" />
                    </el-select>
                </el-form-item>

                <el-form-item label="节点配置" prop="upstream.nodes">
                    <key-value-input @send-data="changeNodes" v-model="formData.upstream.nodes" />
                </el-form-item>
            </el-card>

            <!-- 脚本配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">脚本配置</span>
                </template>

                <el-form-item label="优先级" prop="priority">
                    <el-input-number v-model="formData.priority" :min="0" />
                </el-form-item>

                <el-form-item label="路由脚本" prop="script">
                    <el-input v-model="formData.script" type="textarea" :rows="5" placeholder="请输入路由脚本代码" />
                </el-form-item>
            </el-card>

            <!-- 表单操作 -->
            <div class="form-actions">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, watch } from "vue";
import { getRouterById } from "@/api/index.js"
const props = defineProps({
    patch: {
        type: String,
    },
    dialogVisible: {
        type: Boolean,
    },
});

watch(() => props.patch, (newValue) => {
    if (newValue === "") {
        // 正确方法：逐个属性重置
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)))
        return;
    }
    getRouterById(newValue).then((res) => {
        console.log(res.data.value);
        for (const key of Object.keys(res.data.value)) {
            if (formData[key]) {
                formData[key] = res.data.value[key]
            }
        }
    })
}, { immediate: true });

import {
    ElButton,
    ElCard,
    ElInput,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElRadioGroup,
    ElRadio,
    ElSwitch,
    ElMessage,
} from "element-plus";

// 导入自定义组件
import ArrayInput from "@/components/ArrayInput.vue";
import KeyValueInput from "@/components/KeyValueInput.vue";
import { getRouters, createRouters, PatchRouters } from "@/api/index.js";
import { getNonEmptyValues } from "@/utils/index.js";
// 表单引用
const formRef = ref();
const changeNodes = (data) => {
    for (let item of data) {
        formData.upstream.nodes[item.key] = Number(item.value)
    }

}
// 初始表单数据
let initialFormData = {
    uris: [],
    methods: [],
    hosts: [],
    name: "",
    desc: "",
    remote_addrs: [],
    script: "",
    priority: 0,
    upstream_id: "",
    service_id: "",
    upstream: {
        type: "",
        nodes: {},
    },
    enable_websocket: false,
    status: 1,
};

// 表单数据
let formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// HTTP方法选项
const httpMethods = ref([
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
]);

// 表单验证规则
const rules = {
    name: [
        { required: true, message: "请输入路由名称", trigger: "blur" },
        { min: 2, max: 50, message: "长度在2到50个字符之间", trigger: "blur" },
    ],
    "upstream.type": [
        { required: true, message: "请选择上游类型", trigger: "change" },
    ],
};

// 提交表单
const submitForm = () => {
    let k = getNonEmptyValues(formData)
    if (props.patch !== "") {
        console.log(k);
        PatchRouters(k, props.patch).then((res) => {
            console.log(res);
        });
        return
    }
    createRouters(k).then((res) => {
        console.log(res);
    });

};

// 重置表单
const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
};
</script>

<style scoped>
.route-form-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.form-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
}

.form-actions {
    text-align: center;
    margin-top: 20px;
}
</style>
