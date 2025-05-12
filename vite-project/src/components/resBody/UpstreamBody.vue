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
                        <el-form-item label="name" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入上游名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="desc" prop="desc">
                            <el-input v-model="formData.desc" placeholder="请输入上游描述" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="scheme" prop="scheme">
                            <el-select v-model="formData.scheme" placeholder="请选择协议">
                                <el-option label="http" value="http" />
                                <el-option label="https" value="https" />
                                <el-option label="grpc" value="grpc" />
                                <el-option label="grpcs" value="grpcs" />
                                <el-option label="tcp" value="tcp" />
                                <el-option label="udp" value="udp" />
                                <el-option label="tls" value="tls" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="type" prop="type">
                            <el-select v-model="formData.type" placeholder="请选择负载均衡算法">
                                <el-option label="roundrobin" value="roundrobin" />
                                <el-option label="chash" value="chash" />
                                <el-option label="least_conn" value="least_conn" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="pass_host" prop="pass_host">
                    <el-select v-model="formData.pass_host" placeholder="请选择主机传递方式">
                        <el-option label="pass" value="pass" />
                        <el-option label="node" value="node" />
                        <el-option label="rewrite" value="rewrite" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="formData.pass_host === 'rewrite'" label="upstream_host" prop="upstream_host">
                    <el-input v-model="formData.upstream_host" placeholder="请输入主机名" />
                </el-form-item>

                <el-form-item v-if="formData.type === 'chash'" label="hash_on" prop="hash_on">
                    <el-select v-model="formData.hash_on" placeholder="请选择哈希类型">
                        <el-option label="vars" value="vars" />
                        <el-option label="header" value="header" />
                        <el-option label="cookie" value="cookie" />
                        <el-option label="consumer" value="consumer" />
                        <el-option label="ip" value="ip" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="formData.type === 'chash' && formData.hash_on" label="key" prop="key">
                    <el-input v-model="formData.key" :placeholder="getKeyPlaceholder(formData.hash_on)" />
                </el-form-item>

                <el-form-item label="retries" prop="retries">
                    <el-input-number v-model="formData.retries" :min="0" />
                    <span class="form-item-tip">失败请求的重试次数</span>
                </el-form-item>

                <el-form-item label="retry_timeout" prop="retry_timeout">
                    <el-input-number v-model="formData.retry_timeout" :min="0" />
                    <span class="form-item-tip">重试超时时间（秒）</span>
                </el-form-item>

                <el-form-item label="tls.client_cert_id" prop="tls.client_cert_id">
                    <el-input v-model="formData['tls.client_cert_id']" placeholder="请输入客户端证书ID" />
                    <span class="form-item-tip">连接到上游时使用的客户端证书ID</span>
                </el-form-item>
            </el-card>

            <!-- 节点配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">节点配置</span>
                </template>

                <el-form-item label="nodes" prop="nodes">
                    <el-radio-group v-model="nodesType" @change="handleNodesTypeChange">
                        <el-radio label="hash">哈希格式</el-radio>
                        <el-radio label="array">数组格式</el-radio>
                    </el-radio-group>
                </el-form-item>

                <template v-if="nodesType === 'hash'">
                    <key-value-input v-model="formData.nodes" @send-data="updateNodes"
                        key-placeholder="节点地址 (例如: 127.0.0.1:8080)" value-placeholder="权重 (例如: 100)" />
                </template>

                <template v-else>
                    <div v-for="(node, index) in arrayNodes" :key="index" class="array-node-item">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item :label="'主机 #' + (index + 1)" :prop="'arrayNodes.' + index + '.host'">
                                    <el-input v-model="node.host" placeholder="主机 (例如: 127.0.0.1)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item :label="'端口 #' + (index + 1)" :prop="'arrayNodes.' + index + '.port'">
                                    <el-input-number v-model="node.port" :min="1" :max="65535" placeholder="端口" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item :label="'权重 #' + (index + 1)" :prop="'arrayNodes.' + index + '.weight'">
                                    <el-input-number v-model="node.weight" :min="0" placeholder="权重" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item :label="'优先级 #' + (index + 1)"
                                    :prop="'arrayNodes.' + index + '.priority'">
                                    <el-input-number v-model="node.priority" placeholder="优先级" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="danger" @click="removeArrayNode(index)" icon="Delete" circle />
                            </el-col>
                        </el-row>
                    </div>
                    <el-button type="primary" @click="addArrayNode" plain>添加节点</el-button>
                </template>
            </el-card>

            <!-- 健康检查配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">健康检查</span>
                </template>

                <el-form-item label="启用主动检查">
                    <el-switch v-model="enableActiveChecks" />
                </el-form-item>

                <template v-if="enableActiveChecks">
                    <el-divider content-position="left">主动健康检查</el-divider>

                    <el-form-item label="checks.active.type" prop="checks.active.type">
                        <el-select v-model="formData.checks.active.type" placeholder="请选择检查类型">
                            <el-option label="http" value="http" />
                            <el-option label="https" value="https" />
                            <el-option label="tcp" value="tcp" />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                        label="checks.active.http_path" prop="checks.active.http_path">
                        <el-input v-model="formData.checks.active.http_path" placeholder="HTTP检查路径 (例如: /status)" />
                    </el-form-item>

                    <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                        label="checks.active.host" prop="checks.active.host">
                        <el-input v-model="formData.checks.active.host" placeholder="HTTP检查的Host头" />
                    </el-form-item>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="checks.active.port" prop="checks.active.port">
                                <el-input-number v-model="formData.checks.active.port" :min="1" :max="65535"
                                    placeholder="端口" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="checks.active.timeout" prop="checks.active.timeout">
                                <el-input-number v-model="formData.checks.active.timeout" :min="1"
                                    placeholder="超时时间（秒）" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider>健康状态</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="checks.active.healthy.interval" prop="checks.active.healthy.interval">
                                <el-input-number v-model="formData.checks.active.healthy.interval" :min="1"
                                    placeholder="间隔时间（秒）" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="checks.active.healthy.successes"
                                prop="checks.active.healthy.successes">
                                <el-input-number v-model="formData.checks.active.healthy.successes" :min="1"
                                    placeholder="所需成功次数" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                                label="checks.active.healthy.status" prop="checks.active.healthy.status">
                                <el-select v-model="formData.checks.active.healthy.status" multiple
                                    placeholder="HTTP状态码">
                                    <el-option label="200" value="200" />
                                    <el-option label="201" value="201" />
                                    <el-option label="202" value="202" />
                                    <el-option label="203" value="203" />
                                    <el-option label="204" value="204" />
                                    <el-option label="205" value="205" />
                                    <el-option label="206" value="206" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider>不健康状态</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="checks.active.unhealthy.interval"
                                prop="checks.active.unhealthy.interval">
                                <el-input-number v-model="formData.checks.active.unhealthy.interval" :min="1"
                                    placeholder="间隔时间（秒）" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                                label="checks.active.unhealthy.http_failures"
                                prop="checks.active.unhealthy.http_failures">
                                <el-input-number v-model="formData.checks.active.unhealthy.http_failures" :min="1"
                                    placeholder="HTTP失败次数" />
                            </el-form-item>
                            <el-form-item v-else label="checks.active.unhealthy.tcp_failures"
                                prop="checks.active.unhealthy.tcp_failures">
                                <el-input-number v-model="formData.checks.active.unhealthy.tcp_failures" :min="1"
                                    placeholder="TCP失败次数" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="checks.active.unhealthy.timeouts"
                                prop="checks.active.unhealthy.timeouts">
                                <el-input-number v-model="formData.checks.active.unhealthy.timeouts" :min="1"
                                    placeholder="超时次数" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>

                <el-form-item label="启用被动检查">
                    <el-switch v-model="enablePassiveChecks" />
                </el-form-item>

                <template v-if="enablePassiveChecks">
                    <el-divider content-position="left">被动健康检查</el-divider>

                    <el-form-item label="checks.passive.type" prop="checks.passive.type">
                        <el-select v-model="formData.checks.passive.type" placeholder="请选择检查类型">
                            <el-option label="http" value="http" />
                            <el-option label="https" value="https" />
                            <el-option label="tcp" value="tcp" />
                        </el-select>
                    </el-form-item>

                    <el-divider>健康状态</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="checks.passive.healthy.successes"
                                prop="checks.passive.healthy.successes">
                                <el-input-number v-model="formData.checks.passive.healthy.successes" :min="1"
                                    placeholder="所需成功次数" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                label="checks.passive.healthy.status" prop="checks.passive.healthy.status">
                                <el-select v-model="formData.checks.passive.healthy.status" multiple
                                    placeholder="HTTP状态码">
                                    <el-option label="200" value="200" />
                                    <el-option label="201" value="201" />
                                    <el-option label="202" value="202" />
                                    <el-option label="203" value="203" />
                                    <el-option label="204" value="204" />
                                    <el-option label="205" value="205" />
                                    <el-option label="206" value="206" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider>不健康状态</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                label="checks.passive.unhealthy.http_failures"
                                prop="checks.passive.unhealthy.http_failures">
                                <el-input-number v-model="formData.checks.passive.unhealthy.http_failures" :min="1"
                                    placeholder="HTTP失败次数" />
                            </el-form-item>
                            <el-form-item v-else label="checks.passive.unhealthy.tcp_failures"
                                prop="checks.passive.unhealthy.tcp_failures">
                                <el-input-number v-model="formData.checks.passive.unhealthy.tcp_failures" :min="1"
                                    placeholder="TCP失败次数" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="checks.passive.unhealthy.timeouts"
                                prop="checks.passive.unhealthy.timeouts">
                                <el-input-number v-model="formData.checks.passive.unhealthy.timeouts" :min="1"
                                    placeholder="超时次数" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                label="checks.passive.unhealthy.status" prop="checks.passive.unhealthy.status">
                                <el-select v-model="formData.checks.passive.unhealthy.status" multiple
                                    placeholder="HTTP状态码">
                                    <el-option label="500" value="500" />
                                    <el-option label="502" value="502" />
                                    <el-option label="503" value="503" />
                                    <el-option label="504" value="504" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </el-card>

            <!-- 超时配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">超时配置</span>
                </template>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="connect">
                            <el-input-number v-model="formData.timeout.connect" :min="0" :step="1" placeholder="秒" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="send">
                            <el-input-number v-model="formData.timeout.send" :min="0" :step="1" placeholder="秒" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="read">
                            <el-input-number v-model="formData.timeout.read" :min="0" :step="1" placeholder="秒" />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-card>

            <!-- 标签配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">标签配置</span>
                </template>

                <el-form-item label="labels" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" key-placeholder="键"
                        value-placeholder="值" />
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
import { ref, reactive, watch, defineProps, onMounted } from 'vue';
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
    ElRow,
    ElCol,
    ElRadioGroup,
    ElRadio,
    ElSwitch,
    ElDivider
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
});

// 节点类型选择
const nodesType = ref("hash");
const arrayNodes = ref([]);

// 健康检查开关
const enableActiveChecks = ref(false);
const enablePassiveChecks = ref(false);

// 初始表单数据
const initialFormData = {
    retries: 1,
    retry_timeout: 0,
    nodes: {
        "127.0.0.1:9180": 1
    },
    type: "roundrobin",
    scheme: "http",
    pass_host: "pass",
    upstream_host: "",
    hash_on: "",
    key: "",
    name: "name",
    desc: "desc",
    checks: {
        active: {
            type: "http",
            timeout: 5,
            http_path: "/",
            host: "",
            port: 0,
            healthy: {
                interval: 5,
                successes: 2,
                status: ["200", "201", "202", "203", "204", "205", "206"]
            },
            unhealthy: {
                interval: 5,
                http_failures: 3,
                tcp_failures: 3,
                timeouts: 3
            }
        },
        passive: {
            type: "http",
            healthy: {
                successes: 5,
                status: ["200", "201", "202", "203", "204", "205", "206"]
            },
            unhealthy: {
                http_failures: 5,
                tcp_failures: 5,
                timeouts: 5,
                status: ["500", "502", "503", "504"]
            }
        }
    },
    timeout: {
        connect: 60,
        send: 60,
        read: 60
    },
    labels: {},
    "tls.client_cert_id": ""
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 组件挂载时确保 timeout 对象的值正确显示
onMounted(() => {
    // 确保 timeout 对象存在并且有默认值
    if (!formData.timeout) {
        formData.timeout = {
            connect: 60,
            send: 60,
            read: 60
        };
    }
});

// 监听负载均衡算法变化
watch(() => formData.type, (newVal) => {
    if (newVal !== 'chash') {
        formData.hash_on = '';
        formData.key = '';
    }
});

// 处理节点类型变更
const handleNodesTypeChange = (value) => {
    if (value === "hash") {
        // 将数组格式转换为哈希格式
        convertArrayNodesToHash();
    } else {
        // 将哈希格式转换为数组格式
        convertHashNodesToArray();
    }
};

// 将哈希格式的节点转换为数组格式
const convertHashNodesToArray = () => {
    arrayNodes.value = [];
    for (const [address, weight] of Object.entries(formData.nodes)) {
        const [host, port] = address.split(':');
        arrayNodes.value.push({
            host,
            port: parseInt(port),
            weight,
            priority: 0
        });
    }
};

// 将数组格式的节点转换为哈希格式
const convertArrayNodesToHash = () => {
    formData.nodes = {};
    for (const node of arrayNodes.value) {
        if (node.host && node.port) {
            const address = `${node.host}:${node.port}`;
            formData.nodes[address] = node.weight || 1;
        }
    }
};

// 添加数组格式的节点
const addArrayNode = () => {
    arrayNodes.value.push({
        host: '',
        port: 80,
        weight: 1,
        priority: 0
    });
};

// 移除数组格式的节点
const removeArrayNode = (index) => {
    arrayNodes.value.splice(index, 1);
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
    formData.nodes = {};
    for (const item of data) {
        if (item.key && item.value) {
            formData.nodes[item.key] = Number(item.value);
        }
    }
};

watch(() => props.patch, (newValue) => {
    // 重置表单数据
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
        arrayNodes.value = [];
        nodesType.value = "hash";
        enableActiveChecks.value = false;
        enablePassiveChecks.value = false;
        return;
    }

    // 获取上游详情
    getUpstreamsById(newValue).then((res) => {
        console.log(res.data.value);
        const upstreamData = res.data.value;

        // 重置表单
        const newFormData = JSON.parse(JSON.stringify(initialFormData));

        // 确保 timeout 对象存在并且有默认值
        if (!newFormData.timeout) {
            newFormData.timeout = {
                connect: 60,
                send: 60,
                read: 60
            };
        }

        // 应用到表单数据
        Object.assign(formData, newFormData);

        // 设置节点类型和节点数据
        if (upstreamData.nodes) {
            formData.nodes = upstreamData.nodes;
            nodesType.value = "hash";
            // 如果需要，也可以转换为数组格式
            convertHashNodesToArray();
        }

        // 设置 timeout 对象
        if (upstreamData.timeout) {
            formData.timeout = upstreamData.timeout;
        }

        // 设置健康检查开关
        if (upstreamData.checks && upstreamData.checks.active) {
            enableActiveChecks.value = true;
            formData.checks.active = upstreamData.checks.active;
        } else {
            enableActiveChecks.value = false;
        }

        if (upstreamData.checks && upstreamData.checks.passive) {
            enablePassiveChecks.value = true;
            formData.checks.passive = upstreamData.checks.passive;
        } else {
            enablePassiveChecks.value = false;
        }

        // 设置其他字段
        for (const key of Object.keys(upstreamData)) {
            if (key in formData && !['nodes', 'checks'].includes(key)) {
                formData[key] = upstreamData[key];
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

        // 如果使用数组格式的节点，转换为哈希格式
        if (nodesType.value === "array") {
            convertArrayNodesToHash();
        }

        // 处理健康检查配置
        if (!enableActiveChecks.value) {
            delete formData.checks.active;
        }

        if (!enablePassiveChecks.value) {
            delete formData.checks.passive;
        }

        if (!enableActiveChecks.value && !enablePassiveChecks.value) {
            delete formData.checks;
        }

        // 获取非空值
        const submitData = getNonEmptyValues(formData);
        console.log(submitData);
        if (props.patch !== "") {
            PatchUpstreams(submitData, props.patch).then((res) => {
                ElMessage.success('上游更新成功');
                console.log(res);
            }).catch(err => {
                ElMessage.error('上游更新失败: ' + err.message);
            });
            return;
        }

        createUpstreams(submitData).then((res) => {
            ElMessage.success('上游创建成功');
            resetForm();
        }).catch(err => {
            ElMessage.error('上游创建失败: ' + err.message);
        });
    });
};

// 重置表单
const resetForm = () => {
    // 深拷贝初始表单数据
    const newFormData = JSON.parse(JSON.stringify(initialFormData));

    // 确保 timeout 对象存在并且有默认值
    if (!newFormData.timeout) {
        newFormData.timeout = {
            connect: 60,
            send: 60,
            read: 60
        };
    }

    // 应用到表单数据
    Object.assign(formData, newFormData);

    // 重置其他状态
    arrayNodes.value = [];
    nodesType.value = "hash";
    enableActiveChecks.value = false;
    enablePassiveChecks.value = false;
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

.array-node-item {
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