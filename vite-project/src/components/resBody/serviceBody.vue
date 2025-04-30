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

                <el-form-item label="上游服务ID" prop="upstream_id">
                    <el-input v-model="formData.upstream_id" placeholder="请输入上游服务ID" />
                </el-form-item>

                <el-form-item label="启用WebSocket" prop="enable_websocket">
                    <el-switch v-model="formData.enable_websocket" />
                </el-form-item>
            </el-card>

            <!-- Host配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">Host配置</span>
                </template>

                <array-input v-model="formData.hosts" label="Host列表" placeholder="例如: example.com" />
            </el-card>

            <!-- 标签配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">标签配置</span>
                </template>

                <key-value-input v-model="formData.labels" key-placeholder="标签键 (如: version)"
                    value-placeholder="标签值 (如: v2)" />
            </el-card>

            <!-- 插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">插件配置</span>
                </template>

                <key-value-input v-model="formData.plugins" key-placeholder="插件名称" value-placeholder="插件配置(JSON)" />

                <el-alert title="插件配置需要输入有效的JSON格式" type="info" :closable="false" />
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">上游服务配置</span>
                </template>

                <key-value-input v-model="formData.upstream" key-placeholder="配置项" value-placeholder="配置值" />
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
import { ref, reactive } from 'vue';
import {
    ElButton,
    ElCard,
    ElInput,
    ElForm,
    ElFormItem,
    ElSwitch,
    ElMessage,
    ElAlert,
    ElRow,
    ElCol
} from 'element-plus';

// 导入自定义组件
import ArrayInput from '@/components/ArrayInput.vue';
import KeyValueInput from '@/components/KeyValueInput.vue';

// 表单引用
const formRef = ref();

// 初始表单数据
const initialFormData = {
    plugins: {},
    upstream_id: "1",
    upstream: {},
    name: "",
    desc: "",
    enable_websocket: false,
    hosts: [],
    labels: {}
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入路由名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: 'blur' }
    ],
    upstream_id: [
        { required: true, message: '请输入上游服务ID', trigger: 'blur' }
    ]
};

// 提交表单
const submitForm = async () => {
    try {
        await formRef.value.validate();

        // 验证插件配置是否为有效JSON
        try {
            Object.values(formData.plugins).forEach(value => {
                if (value) JSON.parse(value);
            });
        } catch (e) {
            throw new Error('插件配置必须为有效的JSON格式');
        }

        console.log('提交数据:', JSON.parse(JSON.stringify(formData)));
        ElMessage.success('提交成功');
        // 这里可以添加实际的提交逻辑
    } catch (error) {
        ElMessage.error(error.message || '请检查表单填写是否正确');
    }
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