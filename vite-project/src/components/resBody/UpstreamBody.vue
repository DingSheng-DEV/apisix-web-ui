<template>
    <div class="upstream-form-container">
        <el-form :model="formData" label-width="150px" :rules="rules" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="上游名称" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入上游名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上游描述" prop="desc">
                            <el-input v-model="formData.desc" placeholder="请输入上游描述" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="协议类型" prop="scheme">
                            <el-select v-model="formData.scheme" placeholder="请选择协议类型">
                                <el-option label="HTTP" value="http" />
                                <el-option label="HTTPS" value="https" />
                                <el-option label="GRPC" value="grpc" />
                                <el-option label="GRPCS" value="grpcs" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负载均衡算法" prop="type">
                            <el-select v-model="formData.type" placeholder="请选择负载均衡算法">
                                <el-option label="Round Robin" value="roundrobin" />
                                <el-option label="一致性哈希" value="chash" />
                                <el-option label="最少连接" value="least_conn" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" v-if="formData.type === 'chash'">
                    <el-col :span="12">
                        <el-form-item label="哈希键类型" prop="hash_on">
                            <el-select v-model="formData.hash_on" placeholder="请选择哈希键类型">
                                <el-option label="消费者" value="consumer" />
                                <el-option label="Header" value="header" />
                                <el-option label="Cookie" value="cookie" />
                                <el-option label="变量" value="variable" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="哈希键值" prop="key">
                            <el-input v-model="formData.key" placeholder="请输入哈希键值" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="重试次数" prop="retries">
                    <el-input-number v-model="formData.retries" :min="0" />
                </el-form-item>

                <el-form-item label="客户端证书ID" prop="tls.client_cert_id">
                    <el-input v-model="formData['tls.client_cert_id']" placeholder="请输入客户端证书ID" />
                </el-form-item>
            </el-card>

            <!-- 节点配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">节点配置</span>
                </template>

                <key-value-input v-model="formData.nodes" key-placeholder="节点地址 (如: 127.0.0.1:8080)"
                    value-placeholder="权重 (如: 100)" />
            </el-card>

            <!-- 超时设置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">超时设置 (毫秒)</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="连接超时" prop="timeout.connect">
                            <el-input-number v-model="formData.timeout.connect" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发送超时" prop="timeout.send">
                            <el-input-number v-model="formData.timeout.send" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="读取超时" prop="timeout.read">
                            <el-input-number v-model="formData.timeout.read" :min="0" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 健康检查配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">健康检查配置</span>
                </template>

                <key-value-input v-model="formData.checks" key-placeholder="检查类型" value-placeholder="检查配置(JSON)" />

                <el-alert title="健康检查配置需要输入有效的JSON格式" type="info" :closable="false" />
            </el-card>

            <!-- 标签配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">标签配置</span>
                </template>

                <key-value-input v-model="formData.labels" key-placeholder="标签键 (如: env)"
                    value-placeholder="标签值 (如: production)" />
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
import { ref, reactive, watch } from 'vue';
import {
    ElButton,
    ElCard,
    ElInput,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElMessage,
    ElAlert,
    ElRow,
    ElCol
} from 'element-plus';

// 导入自定义组件
import KeyValueInput from '@/components/KeyValueInput.vue';

// 表单引用
const formRef = ref();

// 初始表单数据
const initialFormData = {
    retries: 1,
    timeout: {
        connect: 0,
        send: 0,
        read: 0,
    },
    nodes: {},
    type: "roundrobin",
    checks: {},
    hash_on: "",
    key: "",
    name: "",
    desc: "",
    scheme: "",
    labels: {},
    "tls.client_cert_id": ""
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入上游名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: 'blur' }
    ],
    scheme: [
        { required: true, message: '请选择协议类型', trigger: 'change' }
    ],
    nodes: [
        {
            validator: (rule, value, callback) => {
                if (Object.keys(value).length === 0) {
                    callback(new Error('至少需要配置一个节点'));
                } else {
                    callback();
                }
            },
            trigger: 'change'
        }
    ],
    'tls.client_cert_id': [
        { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和横线', trigger: 'blur' }
    ]
};

// 监听负载均衡算法变化
watch(() => formData.type, (newVal) => {
    if (newVal !== 'chash') {
        formData.hash_on = '';
        formData.key = '';
    }
});

// 提交表单
const submitForm = async () => {
    try {
        await formRef.value.validate();

        // 验证健康检查配置是否为有效JSON
        try {
            Object.values(formData.checks).forEach(value => {
                if (value) JSON.parse(value);
            });
        } catch (e) {
            throw new Error('健康检查配置必须为有效的JSON格式');
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
.upstream-form-container {
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