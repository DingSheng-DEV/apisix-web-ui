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
                    <span class="section-title">URI配置(必填)</span>
                </template>

                <!-- URI/URIs 选择 -->
                <el-form-item label="URI类型">
                    <el-radio-group v-model="uriType" @change="handleUriTypeChange">
                        <el-radio label="single">单个URI</el-radio>
                        <el-radio label="multiple">多个URI</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="uriType === 'single'" label="URI" prop="uri">
                    <el-input v-model="formData.uri" placeholder="例如: /api/v1" />
                </el-form-item>

                <array-input v-if="uriType === 'multiple'" v-model="formData.uris" label="URI列表"
                    placeholder="例如: /api/v1" />

                <!-- Host/Hosts 选择 -->
                <el-form-item label="Host类型">
                    <el-radio-group v-model="hostType" @change="handleHostTypeChange">
                        <el-radio label="single">单个Host</el-radio>
                        <el-radio label="multiple">多个Host</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="hostType === 'single'" label="Host" prop="host">
                    <el-input v-model="formData.host" placeholder="例如: example.com" />
                </el-form-item>

                <array-input v-if="hostType === 'multiple'" v-model="formData.hosts" label="Host列表"
                    placeholder="例如: example.com" />

                <!-- Remote Addr/Addrs 选择 -->
                <el-form-item label="远程地址类型">
                    <el-radio-group v-model="remoteAddrType" @change="handleRemoteAddrTypeChange">
                        <el-radio label="single">单个地址</el-radio>
                        <el-radio label="multiple">多个地址</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="remoteAddrType === 'single'" label="远程地址" prop="remote_addr">
                    <el-input v-model="formData.remote_addr" placeholder="例如: 192.168.1.1" />
                </el-form-item>

                <array-input v-if="remoteAddrType === 'multiple'" v-model="formData.remote_addrs" label="远程地址列表"
                    placeholder="例如: 192.168.1.1" />

                <!-- HTTP方法 -->
                <array-input v-model="formData.methods" label="HTTP方法" placeholder="例如: GET" :options="httpMethods" />
            </el-card>

            <!-- 高级匹配规则 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">高级匹配规则</span>
                </template>

                <!-- vars 变量匹配 -->
                <el-form-item label="变量匹配规则" prop="vars">
                    <div style="width: 100%;"><el-button type="primary" size="small"
                            @click="addVarRule">添加变量规则</el-button></div>
                    <div v-for="(rule, index) in formData.vars" :key="index" class="var-rule-item">
                        <el-row :gutter="10">
                            <el-col :span="7">
                                <el-input v-model="rule[0]" placeholder="变量名 (如: http_user)" />
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="rule[1]" placeholder="操作符">
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
                                <el-input v-model="rule[2]" placeholder="值 (如: ios)" />
                            </el-col>
                            <el-col :span="3">
                                <el-button type="danger" size="small" @click="removeVarRule(index)">删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <!-- filter_func 过滤函数 -->
                <el-form-item label="过滤函数" prop="filter_func">
                    <el-input v-model="formData.filter_func" type="textarea" :rows="3"
                        placeholder="例如: function(vars) return tonumber(vars.arg_userid) % 4 > 2; end" />
                </el-form-item>

                <!-- 标签 -->
                <el-form-item label="标签" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" key-placeholder="标签键"
                        value-placeholder="标签值" />
                </el-form-item>
            </el-card>

            <!-- 上游服务配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">上游服务配置</span>
                </template>

                <!-- 上游配置类型选择 -->
                <el-form-item label="上游配置方式">
                    <el-radio-group v-model="upstreamType" @change="handleUpstreamTypeChange">
                        <el-radio label="id">使用upstream_id</el-radio>
                        <el-radio label="inline">内联upstream</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 上游ID配置 -->
                <el-form-item v-if="upstreamType === 'id'" label="upstream_id" prop="upstream_id">
                    <el-select v-model="formData.upstream_id" filterable placeholder="Select upstream ID">
                        <el-option v-for="item in upstreamList" :key="item.id"
                            :label="item.id + (item.name ? ' (' + item.name + ')' : '')" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="form-item-tip">Select from existing upstreams</span>
                </el-form-item>

                <!-- 内联上游配置 -->
                <template v-if="upstreamType === 'inline'">
                    <el-form-item label="负载均衡类型" prop="upstream.type">
                        <el-select v-model="formData.upstream.type" placeholder="请选择负载均衡类型">
                            <el-option label="轮询(roundrobin)" value="roundrobin" />
                            <el-option label="一致性哈希(chash)" value="chash" />
                            <el-option label="最少连接(least_conn)" value="least_conn" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="协议类型" prop="upstream.scheme">
                        <el-select v-model="formData.upstream.scheme" placeholder="请选择协议类型">
                            <el-option label="HTTP" value="http" />
                            <el-option label="HTTPS" value="https" />
                            <el-option label="GRPC" value="grpc" />
                            <el-option label="GRPCS" value="grpcs" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="节点配置" prop="upstream.nodes">
                        <key-value-input @send-data="changeNodes" v-model="formData.upstream.nodes"
                            key-placeholder="节点地址 (如: 127.0.0.1:1980)" value-placeholder="权重 (如: 1)" />
                    </el-form-item>
                </template>

                <!-- 服务ID配置 -->
                <el-form-item label="service_id" prop="service_id">
                    <el-select v-model="formData.service_id" filterable placeholder="Select service ID">
                        <el-option v-for="item in serviceList" :key="item.id"
                            :label="item.id + (item.name ? ' (' + item.name + ')' : '')" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="form-item-tip">Select from existing services</span>
                </el-form-item>



                <!-- 超时配置 -->
                <el-form-item label="超时配置">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="连接超时" prop="timeout.connect">
                                <el-input-number v-model="formData.timeout.connect" :min="0" :step="1"
                                    placeholder="秒" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发送超时" prop="timeout.send">
                                <el-input-number v-model="formData.timeout.send" :min="0" :step="1" placeholder="秒" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="读取超时" prop="timeout.read">
                                <el-input-number v-model="formData.timeout.read" :min="0" :step="1" placeholder="秒" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-card>

            <!-- 插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">插件配置</span>
                </template>

                <!-- 插件配置类型选择 -->
                <el-form-item label="插件配置方式">
                    <el-radio-group v-model="pluginType" @change="handlePluginTypeChange">
                        <el-radio label="config_id">使用插件配置ID</el-radio>
                        <el-radio label="inline">内联插件</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 插件配置ID -->
                <el-form-item v-if="pluginType === 'config_id'" label="plugin_config_id" prop="plugin_config_id">
                    <el-input v-model="formData.plugin_config_id" placeholder="请输入插件配置ID" />
                    <span class="form-item-tip">使用已存在的插件配置ID</span>
                </el-form-item>

                <!-- 内联插件配置 -->
                <template v-if="pluginType === 'inline'">
                    <el-form-item label="plugins" prop="plugins">
                        <div style="width: 100%;">
                            <el-button type="primary" size="small" @click="addPlugin">添加插件</el-button>
                        </div>
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
                </template>
            </el-card>

            <!-- 脚本配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">脚本与优先级配置</span>
                </template>

                <el-form-item label="优先级" prop="priority">
                    <el-input-number v-model="formData.priority" :min="0" />
                    <span class="form-item-tip">当不同路由包含相同URI时，根据优先级确定匹配顺序，值越大优先级越高</span>
                </el-form-item>

                <el-form-item label="路由脚本" prop="script">
                    <el-input v-model="formData.script" type="textarea" :rows="5"
                        placeholder="请输入路由脚本代码，用于编写任意Lua代码或直接调用现有插件" :disabled="pluginType === 'config_id'" />
                    <div class="form-item-tip">注意：script 与 plugin_config_id 不能同时使用</div>
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

// 导入自定义组件
import ArrayInput from "@/components/ArrayInput.vue";
import KeyValueInput from "@/components/KeyValueInput.vue";
import { createRouters, PatchRouters, getRouterById, getUpstreams, getServices } from "@/api/index.js";
import { getNonEmptyValues } from "@/utils/index.js";

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

// 二选一参数的类型选择
const uriType = ref("multiple");
const hostType = ref("multiple");
const remoteAddrType = ref("multiple");
const upstreamType = ref("inline");
const pluginType = ref("inline");

// 上游和服务列表
const upstreamList = ref([]);
const serviceList = ref([]);

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

// 处理上游类型变更
const handleUpstreamTypeChange = (value) => {
    if (value === "id") {
        formData.service_id = "";
        // 保留upstream配置，但不提交
    } else if (value === "service") {
        formData.upstream_id = "";
        // 保留upstream配置，但不提交
    } else {
        formData.upstream_id = "";
        formData.service_id = "";
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
    getUpstreams().then(res => {
        if (res.data && res.data.list) {
            upstreamList.value = res.data.list.map(item => ({
                id: item.value.id || item.id,
                name: item.value.name || ''
            }));
        }
    }).catch(err => {
        ElMessage.error('Failed to fetch upstream list: ' + err.message);
    });
};

// 获取服务列表
const fetchServices = () => {
    getServices().then(res => {
        if (res.data && res.data.list) {
            serviceList.value = res.data.list.map(item => ({
                id: item.value.id || item.id,
                name: item.value.name || ''
            }));
        }
    }).catch(err => {
        ElMessage.error('Failed to fetch service list: ' + err.message);
    });
};

// 组件挂载时获取上游和服务列表
onMounted(() => {
    fetchUpstreams();
    fetchServices();
});

watch(() => props.patch, (newValue) => {
    // 重置表单数据
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
        // pluginsList.value = [];
        // uriType.value = "multiple";
        // hostType.value = "multiple";
        // remoteAddrType.value = "multiple";
        // upstreamType.value = "inline";
        // pluginType.value = "inline";
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
        if (routeData.upstream_id) {
            upstreamType.value = "id";
            formData.upstream_id = routeData.upstream_id;
        } else if (routeData.service_id) {
            upstreamType.value = "service";
            formData.service_id = routeData.service_id;
        } else if (routeData.upstream) {
            upstreamType.value = "inline";
            formData.upstream = routeData.upstream;
        }

        // 设置其他字段
        for (const key of Object.keys(routeData)) {
            if (key in formData && !['uri', 'uris', 'host', 'hosts', 'remote_addr', 'remote_addrs', 'upstream', 'upstream_id', 'service_id'].includes(key)) {
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

        if (upstreamType.value === 'id') {
            delete formData.upstream;
            formData.service_id = '';
        } else if (upstreamType.value === 'service') {
            delete formData.upstream;
            formData.upstream_id = '';
        } else {
            formData.upstream_id = '';
            formData.service_id = '';
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
    // pluginsList.value = [];
    // uriType.value = "multiple";
    // hostType.value = "multiple";
    // remoteAddrType.value = "multiple";
    // upstreamType.value = "inline";
    // pluginType.value = "inline";
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

.var-rule-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
}

.plugin-item {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
}

.form-item-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
}
</style>
