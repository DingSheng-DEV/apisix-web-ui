<template>
    <div class="form-container">
        <el-form :model="formData" label-width="180px" :rules="rules" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.basicInfo') }}</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('routes.name')" prop="name">
                            <el-input v-model="formData.name" :placeholder="t('form.enterRouteName')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('form.routeDescLabel')" prop="desc">
                            <el-input v-model="formData.desc" :placeholder="t('form.enterRouteDesc')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="t('routes.status')" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">{{ t('routes.enabled') }}</el-radio>
                        <el-radio :label="0">{{ t('routes.disabled') }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="t('form.enableWebsocket')" prop="enable_websocket">
                    <el-switch v-model="formData.enable_websocket" />
                </el-form-item>
            </el-card>

            <!-- URI配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.uriConfig') }}</span>
                </template>

                <!-- URI/URIs 选择 -->
                <el-form-item :label="t('form.uriType')">
                    <el-radio-group v-model="uriType" @change="handleUriTypeChange">
                        <el-radio label="single">{{ t('form.singleUri') }}</el-radio>
                        <el-radio label="multiple">{{ t('form.multipleUris') }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="uriType === 'single'" :label="t('table.uri')" prop="uri">
                    <el-input v-model="formData.uri" :placeholder="t('form.uriPlaceholder')" />
                </el-form-item>

                <array-input v-if="uriType === 'multiple'" v-model="formData.uris" :label="t('form.uriList')"
                    :placeholder="t('form.uriPlaceholder')" />

                <!-- Host/Hosts 选择 -->
                <el-form-item :label="t('form.hostOptional')" prop="host">
                    <el-input v-model="formData.host" :placeholder="t('form.hostPlaceholder')" />
                    <span class="form-item-tip">{{ t('tips.hostMatch') }}</span>
                </el-form-item>

                <!-- HTTP方法 -->
                <array-input v-model="formData.methods" :label="t('routes.methods')" :placeholder="t('form.httpMethodPlaceholder')" :options="httpMethods" />
            </el-card>

            <!-- 高级匹配规则 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.advancedMatch') }}</span>
                </template>

                <!-- vars 变量匹配 -->
                <el-form-item :label="t('form.varMatchRules')" prop="vars">
                    <div style="width: 100%;"><el-button type="primary" size="small"
                            @click="addVarRule">{{ t('form.addVarRule') }}</el-button></div>
                    <div v-for="(rule, index) in formData.vars" :key="index" class="var-rule-item">
                        <el-row :gutter="10">
                            <el-col :span="7">
                                <el-input v-model="rule[0]" :placeholder="t('form.variableNamePlaceholder')" />
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="rule[1]" :placeholder="t('form.operator')">
                                    <el-option label="==" value="==" />
                                    <el-option label="~=" value="~=" />
                                    <el-option label=">" value=">" />
                                    <el-option label="<" value="<" />
                                    <el-option label=">=" value=">=" />
                                    <el-option label="<=" value="<=" />
                                    <el-option label="in" value="in" />
                                </el-select>
                            </el-col>
                            <el-col :span="7">
                                <el-input v-model="rule[2]" :placeholder="t('form.valuePlaceholder')" />
                            </el-col>
                            <el-col :span="3">
                                <el-button type="danger" size="small" @click="removeVarRule(index)">{{ t('common.delete') }}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <!-- filter_func 过滤函数 -->
                <el-form-item :label="t('form.filterFunc')" prop="filter_func">
                    <el-input v-model="formData.filter_func" type="textarea" :rows="3"
                        :placeholder="t('form.filterFuncPlaceholder')" />
                </el-form-item>

                <!-- 标签 -->
                <el-form-item :label="t('form.labels')" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" :key-placeholder="t('form.keyPlaceholder')"
                        :value-placeholder="t('form.valuePlaceholder')" />
                </el-form-item>
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.upstreamConfig') }}</span>
                </template>

                <!-- 上游配置类型选择 -->
                <el-form-item :label="t('form.upstreamType')">
                    <el-radio-group v-model="upstreamType">
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
                            <el-option label="GRPC" value="grpc" />
                            <el-option label="GRPCS" value="grpcs" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.nodes')" prop="upstream.nodes">
                        <key-value-input @send-data="changeNodes" v-model="formData.upstream.nodes"
                            :key-placeholder="t('form.nodesKeyPlaceholder')" :value-placeholder="t('form.nodesValPlaceholder')" />
                    </el-form-item>
                </template>

                <!-- 服务ID配置 -->
                <el-form-item :label="t('form.serviceId')" prop="service_id">
                    <el-select v-model="formData.service_id" filterable :placeholder="t('form.selectServiceId')" 
                        @focus="onServiceSelectFocus" :loading="serviceLoading">
                        <el-option v-for="item in serviceList" :key="item.id" 
                            :label="item.name || item.id" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="form-item-tip">{{ t('form.chooseFromExistingServices') }}</span>
                </el-form-item>



                <!-- 超时配置 -->
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('form.connectTimeout')" prop="timeout.connect">
                            <el-input-number v-model="formData.timeout.connect" :min="0" :step="1" 
                                controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('form.sendTimeout')" prop="timeout.send">
                            <el-input-number v-model="formData.timeout.send" :min="0" :step="1" 
                                controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('form.readTimeout')" prop="timeout.read">
                            <el-input-number v-model="formData.timeout.read" :min="0" :step="1" 
                                controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('plugins.title') }}</span>
                </template>

                <!-- 插件配置类型选择 -->
                <el-form-item :label="t('form.pluginType')">
                    <el-radio-group v-model="pluginType" @change="handlePluginTypeChange">
                        <el-radio label="config_id">{{ t('form.usePluginConfigId') }}</el-radio>
                        <el-radio label="inline">{{ t('form.inlinePlugin') }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 插件配置ID -->
                <el-form-item v-if="pluginType === 'config_id'" :label="t('form.pluginConfigId')" prop="plugin_config_id">
                    <el-input v-model="formData.plugin_config_id" :placeholder="t('form.pluginConfigIdPlaceholder')" />
                    <span class="form-item-tip">{{ t('tips.useExistingPluginConfigId') }}</span>
                </el-form-item>

                <!-- 内联插件配置 -->
                <template v-if="pluginType === 'inline'">
                    <el-form-item :label="t('form.pluginConfigLabel')" prop="plugins">
                        <div style="width: 100%;">
                            <el-button type="primary" size="small" @click="addPlugin">{{ t('common.add') }}</el-button>
                        </div>
                        <div v-for="(plugin, index) in pluginsList" :key="index" class="plugin-item">
                            <el-row :gutter="12" style="align-items: flex-start;">
                                <el-col :span="5">
                                    <el-select v-model="plugin.name" :placeholder="t('form.selectPlugin')" filterable>
                                        <el-option v-for="item in availablePlugins" :key="item" :label="item"
                                            :value="item" />
                                    </el-select>
                                </el-col>
                                <el-col :span="17">
                                    <el-input v-model="plugin.config" type="textarea" :rows="3"
                                        :placeholder="t('form.pluginConfigPlaceholder')" />
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="danger" text @click="removePlugin(index)" :icon="Delete" />
                                </el-col>
                            </el-row>
                        </div>
                    </el-form-item>
                </template>
            </el-card>

            <!-- 脚本配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.scriptPriorityTitle') }}</span>
                </template>

                <el-form-item :label="t('form.priority')" prop="priority">
                    <el-input-number v-model="formData.priority" :min="0" controls-position="right" style="width: 100%;" />
                    <span class="form-item-tip">{{ t('tips.priority') }}</span>
                </el-form-item>

                <el-form-item :label="t('form.routeScript')" prop="script">
                    <el-input v-model="formData.script" type="textarea" :rows="5"
                        :placeholder="t('form.routeScriptPlaceholder')" :disabled="pluginType === 'config_id'" />
                    <div class="form-item-tip">{{ t('tips.scriptNote') }}</div>
                </el-form-item>
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
import { ref, reactive, defineProps, watch, onMounted } from "vue";
const props = defineProps({
    patch: {
        type: String,
    },
    dialogVisible: {
        type: Boolean,
    },
});
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
    ElRow,
    ElCol,
} from "element-plus";
import { Delete } from '@element-plus/icons-vue';

// 导入自定义组件
import ArrayInput from "@/components/ArrayInput.vue";
import KeyValueInput from "@/components/KeyValueInput.vue";
import { createRouters, PatchRouters, getRouterById, getUpstreams, getServices } from "@/api/index.js";
import { getNonEmptyValues } from "@/utils/index.js";
import { useI18nUtils } from '@/utils/i18n.js';

// 初始表单数据
const initialFormData = {
    uri: "",
    uris: ['example.com'],
    host: "",
    hosts: ['example.com'],
    remote_addr: "",
    remote_addrs: ['127.0.0.1'],
    methods: ['GET'],
    vars: [],
    filter_func: "",
    plugins: {},
    name: "name",
    desc: "desc",
    script: "",
    priority: 0,
    service_id: "",
    upstream_id: "",
    plugin_config_id: "",
    upstream: {
        type: "roundrobin",
        scheme: "http",
        nodes: {
            "127.0.0.1:1980": 1
        },
    },
    timeout: {
        connect: 60,
        send: 60,
        read: 60
    },
    labels: {},
    enable_websocket: false,
    status: 1,
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单引用
const formRef = ref();
const { t } = useI18nUtils();

// 表单验证规则
const rules = {
    uri: [
        { required: true, message: t('validation.required'), trigger: 'blur' }
    ],
    name: [
        { required: true, message: t('validation.required'), trigger: 'blur' }
    ]
};

// 二选一参数的类型选择
const uriType = ref("multiple");
const hostType = ref("multiple");
const remoteAddrType = ref("multiple");
const upstreamType = ref("inline");
const pluginType = ref("inline");

// 上游和服务列表
const upstreamList = ref([]);
const serviceList = ref([]);
const upstreamLoading = ref(false);
const serviceLoading = ref(false);

// 插件列表
const pluginsList = ref([]);
const availablePlugins = ref([
    "limit-count",
]);

// 处理URI类型变更
const handleUriTypeChange = (value) => {
    if (value === "single") {
        formData.uris = [];
    } else {
        formData.uri = "";
    }
};

// 处理Host类型变更
const handleHostTypeChange = (value) => {
    if (value === "single") {
        formData.hosts = [];
    } else {
        formData.host = "";
    }
};

// 处理远程地址类型变更
const handleRemoteAddrTypeChange = (value) => {
    if (value === "single") {
        formData.remote_addrs = [];
    } else {
        formData.remote_addr = "";
    }
};

// 处理插件类型变更
const handlePluginTypeChange = (value) => {
    if (value === "config_id") {
        // 保留plugins配置，但不提交
        pluginsList.value = [];
    } else {
        formData.plugin_config_id = "";
    }
};

// 添加变量规则
const addVarRule = () => {
    if (!formData.vars) {
        formData.vars = [];
    }
    formData.vars.push(["", "==", ""]);
};

// 移除变量规则
const removeVarRule = (index) => {
    formData.vars.splice(index, 1);
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
const changeNodes = (data) => {
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
            console.log(plugin.config);
            try {
                let invalidJson = plugin.config
                // 修复键名和值
                invalidJson = invalidJson.replace(/(\w+):(\w+)/g, '"$1":"$2"');
                // 修复多余的逗号
                invalidJson = invalidJson.replace(/,$/g, '');
                formData.plugins[plugin.name] = JSON.parse(invalidJson);
            } catch (e) {
                console.log(e);

                ElMessage.error(`插件 ${plugin.name} 的配置不是有效的JSON格式`);
                return false;
            }
        }
    }
    return true;
};

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

// 获取服务列表
const fetchServices = () => {
    serviceLoading.value = true;
    getServices().then(res => {
        if (res.data && res.data.list) {
            serviceList.value = res.data.list.map(item => ({
                id: item.value.id || item.id,
                name: item.value.name || item.value.desc || `服务-${item.value.id || item.id}`
            }));
        }
    }).catch(err => {
        ElMessage.error('获取服务列表失败: ' + err.message);
    }).finally(() => {
        serviceLoading.value = false;
    });
};

// 当需要上游列表时才获取
const ensureUpstreamList = () => {
    if (upstreamList.value.length === 0) {
        fetchUpstreams();
    }
};

// 当需要服务列表时才获取
const ensureServiceList = () => {
    if (serviceList.value.length === 0) {
        fetchServices();
    }
};

// 监听上游类型变化，按需加载数据
watch(() => upstreamType.value, (newType) => {
    if (newType === 'id') {
        ensureUpstreamList();
    }
});

// 监听服务ID字段的focus事件，按需加载数据
const onServiceSelectFocus = () => {
    ensureServiceList();
};

watch(() => props.patch, (newValue) => {
    // 重置表单数据
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
        pluginsList.value = [];
        uriType.value = "multiple";
        hostType.value = "multiple";
        remoteAddrType.value = "multiple";
        upstreamType.value = "inline";
        pluginType.value = "inline";
        return;
    }

    // 获取路由详情
    getRouterById(newValue).then((res) => {
        console.log(res.data.value);
        const routeData = res.data.value;

        // 重置表单
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));

        // 设置URI类型
        if (routeData.uri) {
            uriType.value = "single";
            formData.uri = routeData.uri;
        } else if (routeData.uris && routeData.uris.length > 0) {
            uriType.value = "multiple";
            formData.uris = routeData.uris;
        }

        // 设置Host类型
        if (routeData.host) {
            hostType.value = "single";
            formData.host = routeData.host;
        } else if (routeData.hosts && routeData.hosts.length > 0) {
            hostType.value = "multiple";
            formData.hosts = routeData.hosts;
        }

        // 设置远程地址类型
        if (routeData.remote_addr) {
            remoteAddrType.value = "single";
            formData.remote_addr = routeData.remote_addr;
        } else if (routeData.remote_addrs && routeData.remote_addrs.length > 0) {
            remoteAddrType.value = "multiple";
            formData.remote_addrs = routeData.remote_addrs;
        }

        // 设置上游类型
        formData.upstream_id = routeData.upstream_id;
        formData.service_id = routeData.service_id;
        formData.upstream = routeData.upstream;
        if (routeData.upstream_id) {
            upstreamType.value = "id";
        } else if (routeData.upstream) {
            upstreamType.value = "inline";
        }

        // 设置其他字段
        for (const key of Object.keys(routeData)) {
            if (key in formData && !['uri', 'uris', 'host', 'hosts', 'remote_addr', 'remote_addrs'].includes(key)) {
                formData[key] = routeData[key];
            }
        }

        // 设置插件类型和处理插件
        pluginsList.value = [];
        if (routeData.plugin_config_id) {
            pluginType.value = "config_id";
            formData.plugin_config_id = routeData.plugin_config_id;
        } else if (routeData.plugins && Object.keys(routeData.plugins).length > 0) {
            pluginType.value = "inline";
            for (const [name, config] of Object.entries(routeData.plugins)) {
                pluginsList.value.push({
                    name,
                    config: JSON.stringify(config, null, 2)
                });
            }
        } else {
            pluginType.value = "inline";
        }
        console.log(formData);

    });
}, { immediate: true });

// 提交表单
const submitForm = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            ElMessage.error('请检查表单填写是否正确');
            return;
        }
        // 处理插件配置
        if (pluginType.value === "inline") {
            if (!processPlugins()) {
                return;
            }
            // 清除 plugin_config_id
            formData.plugin_config_id = "";
        } else {
            // 清除 plugins
            formData.plugins = {};
        }

        // 根据选择的类型，清除不需要的字段
        if (uriType.value === 'single') {
            formData.uris = [];
        } else {
            formData.uri = '';
        }

        if (hostType.value === 'single') {
            formData.hosts = [];
        } else {
            formData.host = '';
        }

        if (remoteAddrType.value === 'single') {
            formData.remote_addrs = [];
        } else {
            formData.remote_addr = '';
        }

        // 获取非空值
        const submitData = getNonEmptyValues(formData);
        console.log(submitData);

        if (props.patch !== "") {
            PatchRouters(submitData, props.patch).then((res) => {
                ElMessage.success('路由更新成功');
                console.log(res);
            }).catch(err => {
                ElMessage.error('路由更新失败: ' + err.message);
            });
            return;
        }

        createRouters(submitData).then((res) => {
            ElMessage.success('路由创建成功');
            console.log(res);
            resetForm();
        }).catch(err => {
            ElMessage.error('路由创建失败: ' + err.message);
        });
    });
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
    pluginsList.value = [];
    uriType.value = "multiple";
    hostType.value = "multiple";
    remoteAddrType.value = "multiple";
    upstreamType.value = "inline";
    pluginType.value = "inline";
};
</script>

<style scoped>
.plugin-item {
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    background-color: #fafafa;
}

.plugin-item:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}
</style>
