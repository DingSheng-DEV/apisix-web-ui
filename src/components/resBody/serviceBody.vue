<template>
    <div class="form-container">
        <el-form :model="formData" label-width="140px" ref="formRef">
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

                <el-form-item label="服务ID" prop="id">
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

                <array-input v-model="formData.hosts" label="hosts" placeholder="例如: example.com" />
            </el-card>

            <!-- 标签配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">标签配置</span>
                </template>

                <el-form-item label="标签" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" key-placeholder="键"
                        value-placeholder="值" />
                </el-form-item>
            </el-card>

            <!-- 插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">插件配置</span>
                </template>

                <el-form-item label="插件配置" prop="plugins">
                    <el-button type="primary" size="small" @click="addPlugin">添加插件</el-button>
                    <div v-for="(plugin, index) in pluginsList" :key="index" class="plugin-item">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-select v-model="plugin.name" placeholder="选择插件" filterable>
                                    <el-option v-for="item in availablePlugins" :key="item" :label="item"
                                        :value="item" />
                                </el-select>
                            </el-col>
                            <el-col :span="15">
                                <el-input v-model="plugin.config" type="textarea" :rows="3"
                                    placeholder="插件配置 (JSON格式)" />
                            </el-col>
                            <el-col :span="3">
                                <el-button type="danger" size="small" @click="removePlugin(index)">删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <el-alert title="插件配置必须是有效的JSON格式" type="info" :closable="false" />
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">上游服务配置</span>
                </template>

                <!-- 上游配置类型选择 -->
                <el-form-item label="上游配置类型">
                    <el-radio-group v-model="upstreamType" @change="handleUpstreamTypeChange">
                        <el-radio label="id">使用上游ID</el-radio>
                        <el-radio label="inline">内联配置</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 上游ID配置 -->
                <el-form-item v-if="upstreamType === 'id'" label="上游ID" prop="upstream_id">
                    <el-select v-model="formData.upstream_id" filterable placeholder="选择上游ID" 
                        @focus="ensureUpstreamList" :loading="upstreamLoading">
                        <el-option v-for="item in upstreamList" :key="item.id"
                            :label="item.name || item.id" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="form-item-tip">从现有上游中选择</span>
                </el-form-item>

                <!-- 内联上游配置 -->
                <template v-if="upstreamType === 'inline'">
                    <el-form-item label="负载均衡类型" prop="upstream.type">
                        <el-select v-model="formData.upstream.type" placeholder="选择负载均衡算法">
                            <el-option label="轮询" value="roundrobin" />
                            <el-option label="一致性哈希" value="chash" />
                            <el-option label="最少连接" value="least_conn" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="协议类型" prop="upstream.scheme">
                        <el-select v-model="formData.upstream.scheme" placeholder="选择协议">
                            <el-option label="HTTP" value="http" />
                            <el-option label="HTTPS" value="https" />
                            <el-option label="gRPC" value="grpc" />
                            <el-option label="gRPCs" value="grpcs" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="主机传递" prop="upstream.pass_host">
                        <el-select v-model="formData.upstream.pass_host" placeholder="选择主机传递方式">
                            <el-option label="透传" value="pass" />
                            <el-option label="节点" value="node" />
                            <el-option label="重写" value="rewrite" />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="formData.upstream.pass_host === 'rewrite'" label="上游主机"
                        prop="upstream.upstream_host">
                        <el-input v-model="formData.upstream.upstream_host" placeholder="请输入主机名" />
                    </el-form-item>

                    <el-form-item label="哈希类型" prop="upstream.hash_on" v-if="formData.upstream.type === 'chash'">
                        <el-select v-model="formData.upstream.hash_on" placeholder="选择哈希类型">
                            <el-option label="变量" value="vars" />
                            <el-option label="请求头" value="header" />
                            <el-option label="Cookie" value="cookie" />
                            <el-option label="消费者" value="consumer" />
                            <el-option label="IP地址" value="ip" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="哈希键" prop="upstream.key"
                        v-if="formData.upstream.type === 'chash' && formData.upstream.hash_on">
                        <el-input v-model="formData.upstream.key"
                            :placeholder="getKeyPlaceholder(formData.upstream.hash_on)" />
                    </el-form-item>

                    <el-divider content-position="left">节点配置</el-divider>

                    <el-form-item label="节点配置" prop="upstream.nodes">
                        <key-value-input @send-data="updateNodes" v-model="formData.upstream.nodes"
                            key-placeholder="节点地址 (例如: 127.0.0.1:1980)" value-placeholder="权重 (例如: 1)" />
                    </el-form-item>

                    <el-alert title="节点格式为 IP:端口，权重为正整数，权重越高分配的请求越多" type="info" :closable="false"
                        style="margin-top: 10px;" />
                </template>
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
import { ref, reactive, defineProps, watch, onMounted } from 'vue';
import {
    ElButton,
    ElCard,
    ElInput,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElSwitch,
    ElMessage,
    ElAlert,
    ElRow,
    ElCol,
    ElRadioGroup,
    ElRadio,
    ElSelect,
    ElOption,
    ElDivider
} from 'element-plus';
import { getServicesId, PatchServices, createServices, getUpstreams } from "@/api/index.js"
import { getNonEmptyValues } from "@/utils/index.js";
// 导入自定义组件
import ArrayInput from '@/components/ArrayInput.vue';
import KeyValueInput from '@/components/KeyValueInput.vue';

// 初始表单数据
const initialFormData = {
    plugins: {},
    id: "",
    upstream_id: "",
    upstream: {
        type: "roundrobin",
        nodes: {
            " 127.0.0.1": 1
        },
        scheme: "http",
        pass_host: "pass",
        hash_on: "",
        key: "",
        upstream_host: ""
    },
    name: "name",
    desc: "desc",
    enable_websocket: false,
    hosts: [],
    labels: {}
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单引用
const formRef = ref();

// 上游配置类型
const upstreamType = ref("inline");

// 上游列表
const upstreamList = ref([]);
const upstreamLoading = ref(false);

// 插件列表
const pluginsList = ref([]);
const availablePlugins = ref([
    "limit-count",
    "limit-req",
    "jwt-auth",
    "key-auth",
    "basic-auth",
    "ip-restriction",
    "cors",

]);

// 处理上游类型变更
const handleUpstreamTypeChange = (value) => {
    if (value === "id") {
        // 保留upstream配置，但不提交
    } else {
        formData.upstream_id = "";
    }
};

// 添加插件
const addPlugin = () => {
    pluginsList.value.push({
        name: "",
        config: "{}"
    });
};

// 移除插件
const removePlugin = (index) => {
    pluginsList.value.splice(index, 1);
};

// 更新标签
const updateLabels = (data) => {
    formData.labels = {};
    for (const item of data) {
        if (item.key && item.value) {
            formData.labels[item.key] = item.value;
        }
    }
};

// 更新节点配置
const updateNodes = (data) => {
    formData.upstream.nodes = {};
    for (const item of data) {
        if (item.key && item.value) {
            formData.upstream.nodes[item.key] = Number(item.value);
        }
    }
};

// 处理插件配置
const processPlugins = () => {
    formData.plugins = {};
    for (const plugin of pluginsList.value) {
        if (plugin.name && plugin.config) {
            try {
                formData.plugins[plugin.name] = JSON.parse(plugin.config);
            } catch (e) {
                ElMessage.error(`插件 ${plugin.name} 配置不是有效的JSON格式`);
                return false;
            }
        }
    }
    return true;
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

// 获取上游列表
const fetchUpstreams = () => {
    upstreamLoading.value = true;
    getUpstreams().then(res => {
        if (res.data && res.data.list) {
            upstreamList.value = res.data.list.map(item => ({
                id: item.value.id || item.id,
                name: item.value.name || item.value.desc || `上游-${item.value.id || item.id}`
            }));
        }
    }).catch(err => {
        ElMessage.error('获取上游列表失败: ' + err.message);
    }).finally(() => {
        upstreamLoading.value = false;
    });
};

// 当需要上游列表时才获取
const ensureUpstreamList = () => {
    if (upstreamList.value.length === 0) {
        fetchUpstreams();
    }
};

// 监听上游类型变化，按需加载数据
watch(() => upstreamType.value, (newType) => {
    if (newType === 'id') {
        ensureUpstreamList();
    }
});

watch(() => props.patch, (newValue) => {
    // 重置表单数据
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
        pluginsList.value = [];
        upstreamType.value = "inline";
        return;
    }

    // 获取服务详情
    getServicesId(newValue).then((res) => {
        console.log(res.data.value);
        const serviceData = res.data.value;

        // 重置表单
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));

        // 设置上游类型
        if (serviceData.upstream_id) {
            upstreamType.value = "id";
            formData.upstream_id = serviceData.upstream_id;
        } else if (serviceData.upstream) {
            upstreamType.value = "inline";
            formData.upstream = serviceData.upstream;
        }

        // 设置其他字段
        for (const key of Object.keys(serviceData)) {
            if (key in formData && !['upstream', 'upstream_id'].includes(key)) {
                formData[key] = serviceData[key];
            }
        }

        // 处理插件
        pluginsList.value = [];
        if (serviceData.plugins) {
            for (const [name, config] of Object.entries(serviceData.plugins)) {
                pluginsList.value.push({
                    name,
                    config: JSON.stringify(config, null, 2)
                });
            }
        }
    });
}, { immediate: true });

// 提交表单
const submitForm = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            ElMessage.error('请检查表单字段');
            return;
        }

        // 处理插件配置
        if (!processPlugins()) {
            return;
        }

        // 根据选择的类型，清除不需要的字段
        if (upstreamType.value === 'id') {
            delete formData.upstream;
        } else {
            formData.upstream_id = '';
        }

        // 获取非空值
        const submitData = getNonEmptyValues(formData);
        console.log(submitData);
        if (props.patch !== "") {
            PatchServices(submitData, props.patch).then((res) => {
                ElMessage.success('服务更新成功');
                console.log(res);
            }).catch(err => {
                ElMessage.error('服务更新失败: ' + err.message);
            });
            return;
        }

        createServices(submitData).then((res) => {
            ElMessage.success('服务创建成功');
            resetForm();
        }).catch(err => {
            ElMessage.error('服务创建失败: ' + err.message);
        });
    });
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
    pluginsList.value = [];
    upstreamType.value = "inline";
};
</script>

<style scoped>
/* 使用全局统一样式，无需额外CSS */
</style>