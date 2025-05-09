<template>
    <div class="route-form-container">
        <el-form :model="formData" label-width="120px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="服务名称" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入服务名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务描述" prop="desc">
                            <el-input v-model="formData.desc" placeholder="请输入服务描述" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="服务ID" prop="upstream_id">
                    <el-input v-model="formData.id" placeholder="请输入服务ID" />
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

                <el-form-item label="负载均衡类型" prop="upstream.type">
                    <el-select v-model="formData.upstream.type" placeholder="请选择负载均衡类型">
                        <el-option label="轮询(Round Robin)" value="roundrobin" />
                        <el-option label="一致性哈希(CHash)" value="chash" />
                        <el-option label="最少连接(Least Conn)" value="least_conn" />
                    </el-select>
                </el-form-item>

                <el-form-item label="协议类型" prop="upstream.scheme">
                    <el-select v-model="formData.upstream.scheme" placeholder="请选择协议类型">
                        <el-option label="HTTP" value="http" />
                        <el-option label="HTTPS" value="https" />
                        <el-option label="gRPC" value="grpc" />
                        <el-option label="gRPCs" value="grpcs" />
                    </el-select>
                </el-form-item>

                <el-form-item label="传递主机" prop="upstream.pass_host">
                    <el-select v-model="formData.upstream.pass_host" placeholder="请选择主机传递方式">
                        <el-option label="传递客户端请求的主机(pass)" value="pass" />
                        <el-option label="使用上游主机(node)" value="node" />
                        <el-option label="使用指定主机(rewrite)" value="rewrite" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="formData.upstream.pass_host === 'rewrite'" label="指定主机"
                    prop="upstream.upstream_host">
                    <el-input v-model="formData.upstream.upstream_host" placeholder="请输入指定的主机名" />
                </el-form-item>

                <el-form-item label="哈希类型" prop="upstream.hash_on" v-if="formData.upstream.type === 'chash'">
                    <el-select v-model="formData.upstream.hash_on" placeholder="请选择哈希类型">
                        <el-option label="变量(vars)" value="vars" />
                        <el-option label="头部(header)" value="header" />
                        <el-option label="Cookie" value="cookie" />
                        <el-option label="消费者(consumer)" value="consumer" />
                        <el-option label="IP(ip)" value="ip" />
                    </el-select>
                </el-form-item>

                <el-form-item label="哈希键" prop="upstream.key"
                    v-if="formData.upstream.type === 'chash' && formData.upstream.hash_on">
                    <el-input v-model="formData.upstream.key"
                        :placeholder="getKeyPlaceholder(formData.upstream.hash_on)" />
                </el-form-item>

                <el-divider content-position="left">节点配置</el-divider>

                <el-form-item label="节点列表" prop="upstream.nodes">
                    <key-value-input @send-data="updateNodes" v-model="formData.upstream.nodes"
                        key-placeholder="节点地址 (如: 127.0.0.1:1980)" value-placeholder="权重 (如: 1)" />
                </el-form-item>

                <el-alert title="节点格式为 IP:端口，权重为正整数，权重越高分配的请求越多" type="info" :closable="false"
                    style="margin-top: 10px;" />
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
import { ref, reactive, defineProps, watch } from 'vue';
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
    ElCol,
    ElSelect,
    ElOption,
    ElDivider
} from 'element-plus';
import { getServicesId, PatchServices, DeleteServicesID, createServices } from "@/api/index.js"
import { getNonEmptyValues } from "@/utils/index.js";

// 导入自定义组件
import ArrayInput from '@/components/ArrayInput.vue';
import KeyValueInput from '@/components/KeyValueInput.vue';
// 初始表单数据
let initialFormData = {
    plugins: {},
    id: "",
    upstream: {
        type: "roundrobin",
        nodes: {},
        scheme: "http",
        pass_host: "pass",
        hash_on: "",
        key: "",
        upstream_host: ""
    },
    name: "",
    desc: "",
    enable_websocket: false,
    hosts: [],
    labels: {}
};

// 表单数据
let formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单引用
const formRef = ref();

// 更新节点配置
const updateNodes = (data) => {
    formData.upstream.nodes = {};
    for (let item of data) {
        if (item.key && item.value) {
            formData.upstream.nodes[item.key] = Number(item.value);
        }
    }
};

// 根据哈希类型获取占位符文本
const getKeyPlaceholder = (hashOn) => {
    switch (hashOn) {
        case 'vars':
            return '请输入变量名，例如：uri, server_name';
        case 'header':
            return '请输入HTTP头名称，例如：User-Agent';
        case 'cookie':
            return '请输入Cookie名称';
        case 'consumer':
            return '留空，将使用消费者ID';
        case 'ip':
            return '留空，将使用客户端IP';
        default:
            return '请输入哈希键';
    }
};

const props = defineProps({
    patch: {
        type: String,
        default: "",
    },
    total: {
        type: Number,
    },
});

watch(() => props.patch, (newValue) => {
    console.log(newValue);
    if (newValue === "") {
        // 正确方法：逐个属性重置
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)))

        return;
    }
    getServicesId(newValue).then((res) => {
        for (const key of Object.keys(res.data.value)) {
            if (formData[key] !== undefined) {
                console.log(key);
                formData[key] = res.data.value[key]
            }
        }
    })
}, { immediate: true });


// 提交表单
const submitForm = () => {
    let k = getNonEmptyValues(formData)
    if (props.patch !== "") {
        console.log(k);
        PatchServices(k, props.patch).then((res) => {
            console.log(res);
        });
        return
    }
    createServices(k, props.total).then((res) => {
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