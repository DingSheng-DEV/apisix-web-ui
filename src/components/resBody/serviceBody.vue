<template>
    <div class="form-container">
        <el-form :model="formData" label-width="140px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.basicInfo') }}</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('services.name')" prop="name">
                            <el-input v-model="formData.name" :placeholder="t('form.enterServiceName')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('services.description')" prop="desc">
                            <el-input v-model="formData.desc" :placeholder="t('form.enterServiceDesc')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="t('form.serviceId')" prop="id">
                    <el-input v-model="formData.id" :placeholder="t('form.inputServiceId')" />
                </el-form-item>

                <el-form-item :label="t('form.enableWebsocket')" prop="enable_websocket">
                    <el-switch v-model="formData.enable_websocket" />
                </el-form-item>
            </el-card>

            <!-- Host配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('table.hosts') }}</span>
                </template>

                <array-input v-model="formData.hosts" :label="t('table.hosts')" :placeholder="'example.com'" />
            </el-card>

            <!-- 标签配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.labels') }}</span>
                </template>

                <el-form-item :label="t('form.labels')" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" :key-placeholder="t('form.keyPlaceholder')"
                        :value-placeholder="t('form.valuePlaceholder')" />
                </el-form-item>
            </el-card>

            <!-- 插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('plugins.title') }}</span>
                </template>

                <el-form-item :label="t('form.pluginConfigLabel')" prop="plugins">
                    <el-button type="primary" size="small" @click="addPlugin">{{ t('common.add') }}</el-button>
                    <div v-for="(plugin, index) in pluginsList" :key="index" class="plugin-item">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-select v-model="plugin.name" :placeholder="t('form.selectPlugin')" filterable>
                                    <el-option v-for="item in availablePlugins" :key="item" :label="item"
                                        :value="item" />
                                </el-select>
                            </el-col>
                            <el-col :span="15">
                                <el-input v-model="plugin.config" type="textarea" :rows="3"
                                    :placeholder="t('form.pluginConfigPlaceholder')" />
                            </el-col>
                            <el-col :span="3">
                                <el-button type="danger" size="small" @click="removePlugin(index)">{{ t('common.delete') }}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <el-alert :title="t('plugins.jsonConfigTip')" type="info" :closable="false" />
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.upstreamConfig') }}</span>
                </template>

                <!-- 上游配置类型选择 -->
                <el-form-item :label="t('form.upstreamType')">
                    <el-radio-group v-model="upstreamType" @change="handleUpstreamTypeChange">
                        <el-radio label="id">{{ t('form.useUpstreamId') }}</el-radio>
                        <el-radio label="inline">{{ t('form.inlineUpstream') }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 上游ID配置 -->
                <el-form-item v-if="upstreamType === 'id'" :label="t('form.upstreamId')" prop="upstream_id">
                    <el-select v-model="formData.upstream_id" filterable :placeholder="t('form.selectUpstreamId')" 
                        @focus="ensureUpstreamList" :loading="upstreamLoading">
                        <el-option v-for="item in upstreamList" :key="item.id"
                            :label="item.name || item.id" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="form-item-tip">{{ t('form.chooseFromExistingUpstreams') }}</span>
                </el-form-item>

                <!-- 内联上游配置 -->
                <template v-if="upstreamType === 'inline'">
                    <el-form-item :label="t('form.loadBalanceType')" prop="upstream.type">
                        <el-select v-model="formData.upstream.type" :placeholder="t('form.selectLoadBalanceType')">
                            <el-option :label="t('upstreams.roundrobin')" value="roundrobin" />
                            <el-option :label="t('upstreams.chash')" value="chash" />
                            <el-option :label="t('upstreams.leastConn')" value="least_conn" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.protocolType')" prop="upstream.scheme">
                        <el-select v-model="formData.upstream.scheme" :placeholder="t('form.selectProtocol')">
                            <el-option label="HTTP" value="http" />
                            <el-option label="HTTPS" value="https" />
                            <el-option label="gRPC" value="grpc" />
                            <el-option label="gRPCs" value="grpcs" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.passHostMode')" prop="upstream.pass_host">
                        <el-select v-model="formData.upstream.pass_host" :placeholder="t('form.selectPassHostMode')">
                            <el-option :label="t('form.passThrough')" value="pass" />
                            <el-option :label="t('form.nodeMode')" value="node" />
                            <el-option :label="t('form.rewriteMode')" value="rewrite" />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="formData.upstream.pass_host === 'rewrite'" :label="t('form.upstreamHost')"
                        prop="upstream.upstream_host">
                        <el-input v-model="formData.upstream.upstream_host" :placeholder="t('form.enterUpstreamHost')" />
                    </el-form-item>

                    <el-form-item :label="t('form.hashType')" prop="upstream.hash_on" v-if="formData.upstream.type === 'chash'">
                        <el-select v-model="formData.upstream.hash_on" :placeholder="t('form.selectHashType')">
                            <el-option :label="t('upstreams.vars')" value="vars" />
                            <el-option :label="t('upstreams.header')" value="header" />
                            <el-option label="Cookie" value="cookie" />
                            <el-option :label="t('upstreams.consumer')" value="consumer" />
                            <el-option :label="t('upstreams.ipAddress')" value="ip" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.hashKey')" prop="upstream.key"
                        v-if="formData.upstream.type === 'chash' && formData.upstream.hash_on">
                        <el-input v-model="formData.upstream.key"
                            :placeholder="getKeyPlaceholder(formData.upstream.hash_on)" />
                    </el-form-item>

                    <el-divider content-position="left">{{ t('form.nodesSectionTitle') }}</el-divider>

                    <el-form-item :label="t('form.nodes')" prop="upstream.nodes">
                        <key-value-input @send-data="updateNodes" v-model="formData.upstream.nodes"
                            :key-placeholder="t('form.nodesKeyPlaceholder')" :value-placeholder="t('form.nodesValPlaceholder')" />
                    </el-form-item>

                    <el-alert :title="t('tips.nodesFormatTip')" type="info" :closable="false"
                        style="margin-top: 10px;" />
                </template>
            </el-card>
            <!-- 表单操作 -->
            <div class="form-actions">
                <el-button type="primary" @click="submitForm">{{ t('common.submit') }}</el-button>
                <el-button @click="resetForm">{{ t('common.reset') }}</el-button>
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
import { useI18nUtils } from '@/utils/i18n.js';
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
const { t } = useI18nUtils();

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
                ElMessage.error(`${t('plugins.name')} ${plugin.name} ${t('plugins.jsonConfigTip')}`);
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
            return t('form.hashKeyPlaceholderVars');
        case 'header':
            return t('form.hashKeyPlaceholderHeader');
        case 'cookie':
            return t('form.hashKeyPlaceholderCookie');
        case 'consumer':
            return t('form.hashKeyPlaceholderConsumer');
        case 'ip':
            return t('form.hashKeyPlaceholderIp');
        default:
            return t('form.hashKeyPlaceholder');
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
                name: item.value.name || item.value.desc || `${t('upstreams.name')}-${item.value.id || item.id}`
            }));
        }
    }).catch(err => {
        ElMessage.error(t('messages.operationFailed') + ': ' + err.message);
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