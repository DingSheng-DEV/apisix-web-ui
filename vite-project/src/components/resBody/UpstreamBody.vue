<template>
    <div class="upstream-form-container">
        <el-form :model="formData" label-width="150px" ref="formRef">
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
                                <el-option label="一致性哈希" value="roundrobin" />
                                <el-option label="最少连接" value="roundrobin" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="哈希键类型" prop="hash_on">
                            <el-select v-model="formData.hash_on" placeholder="请选择哈希键类型">
                                <el-option label="消费者" value="vars" />
                                <el-option label="Header" value="vars" />
                                <el-option label="Cookie" value="vars" />
                                <el-option label="变量" value="vars" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="哈希键值" prop="key">
                            <el-input v-model="formData.key" placeholder="请输入哈希键值" />
                        </el-form-item>
                    </el-col> -->
                </el-row>

                <el-form-item label="重试次数" prop="retries">
                    <el-input-number v-model="formData.retries" :min="0" />
                </el-form-item>
                <!-- 
                <el-form-item label="客户端证书ID" prop="tls.client_cert_id">
                    <el-input v-model="formData['tls.client_cert_id']" placeholder="请输入客户端证书ID" />
                </el-form-item> -->
            </el-card>

            <!-- 节点配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">节点配置</span>
                </template>

                <key-value-input v-model="formData.nodes" @send-data="updateNodes"
                    key-placeholder="节点地址 (如: 127.0.0.1:8080)" value-placeholder="权重 (如: 100)" />
            </el-card>
            <!-- 健康检查配置 -->
            <!-- <el-card class="form-section">
                <template #header>
                    <span class="section-title">健康检查配置</span>
                </template>

                <key-value-input v-model="formData.checks" key-placeholder="检查类型" value-placeholder="检查配置(JSON)" />

                <el-alert title="健康检查配置需要输入有效的JSON格式" type="info" :closable="false" />
            </el-card> -->

            <!-- 标签配置 -->
            <!-- <el-card class="form-section">
                <template #header>
                    <span class="section-title">标签配置</span>
                </template>

                <key-value-input v-model="formData.labels" key-placeholder="标签键 (如: env)"
                    value-placeholder="标签值 (如: production)" />
            </el-card> -->

            <!-- 表单操作 -->
            <div class="form-actions">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, watch, defineProps } from 'vue';
import { getNonEmptyValues } from "@/utils/index.js";
import { createUpstreams, getUpstreamsById, PatchUpstreams } from "@/api/index.js";
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
const props = defineProps({
    total: {
        type: Number,
    },
    patch: {
        type: String,
    },
})
// 初始表单数据
const initialFormData = {
    retries: 1,
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

// 监听负载均衡算法变化
watch(() => formData.type, (newVal) => {
    if (newVal !== 'chash') {
        formData.hash_on = '';
        formData.key = '';
    }
});

watch(() => props.patch, (newValue) => {
    if (newValue === "") {
        // 正确方法：逐个属性重置
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)))
        return;
    }
    getUpstreamsById(newValue).then((res) => {
        for (const key of Object.keys(res.data.value)) {
            if (formData[key] !== undefined) {
                formData[key] = res.data.value[key]
            }
        }
    })
}, { immediate: true });



// 提交表单
const submitForm = () => {
    let k = getNonEmptyValues(formData)
    if (props.patch !== "") {
        PatchUpstreams(k, props.patch).then((res) => {
            console.log(res);
        });
        return
    }

    createUpstreams(k, props.total).then((res) => {
        console.log(res);
    })
}

// 重置表单
const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
};

// 更新节点配置
const updateNodes = (data) => {
    formData.nodes = {};
    for (let item of data) {
        if (item.key && item.value) {
            formData.nodes[item.key] = Number(item.value);
        }
    }
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