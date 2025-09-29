<template>
    <div class="form-container">
        <el-form :model="formData" label-width="180px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.basicInfo') }}</span>
                </template>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('upstreams.name')" prop="name">
                            <el-input v-model="formData.name" :placeholder="t('form.enterUpstreamName')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('services.description')" prop="desc">
                            <el-input v-model="formData.desc" :placeholder="t('form.enterUpstreamDesc')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('form.protocolType')" prop="scheme">
                            <el-select v-model="formData.scheme" :placeholder="t('form.selectProtocol')">
                                <el-option label="HTTP" value="http" />
                                <el-option label="HTTPS" value="https" />
                                <el-option label="gRPC" value="grpc" />
                                <el-option label="gRPCs" value="grpcs" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('form.loadBalanceType')" prop="type">
                            <el-select v-model="formData.type" :placeholder="t('form.selectLoadBalanceType')">
                                <el-option :label="t('upstreams.roundrobin')" value="roundrobin" />
                                <el-option :label="t('upstreams.chash')" value="chash" />
                                <el-option :label="t('upstreams.leastConn')" value="least_conn" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="t('form.passHostMode')" prop="pass_host">
                    <el-select v-model="formData.pass_host" :placeholder="t('form.selectPassHostMode')">
                        <el-option :label="t('form.passThrough')" value="pass" />
                        <el-option :label="t('form.nodeMode')" value="node" />
                        <el-option :label="t('form.rewriteMode')" value="rewrite" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="formData.pass_host === 'rewrite'" :label="t('form.upstreamHost')" prop="upstream_host">
                    <el-input v-model="formData.upstream_host" :placeholder="t('form.enterUpstreamHost')" />
                </el-form-item>

                <el-form-item v-if="formData.type === 'chash'" :label="t('form.hashType')" prop="hash_on">
                    <el-select v-model="formData.hash_on" :placeholder="t('form.selectHashType')">
                        <el-option label="变量(vars)" value="vars" />
                        <el-option label="请求头(header)" value="header" />
                        <el-option label="Cookie" value="cookie" />
                        <el-option label="消费者(consumer)" value="consumer" />
                        <el-option label="IP地址" value="ip" />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="formData.type === 'chash' && formData.hash_on" :label="t('form.hashKey')" prop="key">
                    <el-input v-model="formData.key" :placeholder="getKeyPlaceholder(formData.hash_on)" />
                </el-form-item>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('form.retries')" prop="retries">
                            <el-input-number v-model="formData.retries" :min="0" controls-position="right" style="width: 100%;" />
                            <span class="form-item-tip">{{ t('tips.retriesTip') }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('form.retryTimeout')" prop="retry_timeout">
                            <el-input-number v-model="formData.retry_timeout" :min="0" controls-position="right" style="width: 100%;" />
                            <span class="form-item-tip">{{ t('tips.retryTimeoutTip') }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="t('form.tlsClientCertId')" prop="tls.client_cert_id">
                    <el-input v-model="formData['tls.client_cert_id']" :placeholder="t('form.enterTlsClientCertId')" />
                    <span class="form-item-tip">{{ t('tips.tlsClientCertTip') }}</span>
                </el-form-item>
            </el-card>

            <!-- 节点配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.nodesSectionTitle') }}</span>
                </template>

                <el-form-item :label="t('form.nodesFormat')" prop="nodes">
                    <el-radio-group v-model="nodesType" @change="handleNodesTypeChange">
                        <el-radio label="hash">{{ t('form.hashFormat') }}</el-radio>
                        <el-radio label="array">{{ t('form.arrayFormat') }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <template v-if="nodesType === 'hash'">
                    <key-value-input v-model="formData.nodes" @send-data="updateNodes"
                        :key-placeholder="t('form.nodesKeyPlaceholder')" :value-placeholder="t('form.nodesValPlaceholder')" />
                </template>

                <template v-else>
                    <div v-for="(node, index) in arrayNodes" :key="index" class="array-node-item">
                        <el-row :gutter="12">
                            <el-col :span="8">
                                <el-form-item :label="`${t('form.host')} #${index + 1}`" :prop="'arrayNodes.' + index + '.host'">
                                    <el-input v-model="node.host" :placeholder="t('form.hostPlaceholder')" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item :label="`${t('form.port')} #${index + 1}`" :prop="'arrayNodes.' + index + '.port'">
                                    <el-input-number v-model="node.port" :min="1" :max="65535" controls-position="right" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item :label="`${t('form.weight')} #${index + 1}`" :prop="'arrayNodes.' + index + '.weight'">
                                    <el-input-number v-model="node.weight" :min="0" controls-position="right" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item :label="`${t('form.priorityField')} #${index + 1}`"
                                    :prop="'arrayNodes.' + index + '.priority'">
                                    <el-input-number v-model="node.priority" controls-position="right" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <div style="padding-top: 32px;">
                                    <el-button type="danger" text @click="removeArrayNode(index)" :icon="Delete" />
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-button type="primary" @click="addArrayNode" plain>{{ t('form.addNode') }}</el-button>
                </template>
            </el-card>

            <!-- 健康检查配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('upstreams.healthCheck') }}</span>
                </template>

                <el-form-item :label="t('upstreams.enableActiveChecks')">
                    <el-switch v-model="enableActiveChecks" />
                </el-form-item>

                <template v-if="enableActiveChecks">
                    <el-divider content-position="left">{{ t('upstreams.activeHealthCheck') }}</el-divider>

                    <el-form-item :label="t('upstreams.checkType')" prop="checks.active.type">
                        <el-select v-model="formData.checks.active.type" :placeholder="t('upstreams.selectCheckType')">
                            <el-option label="HTTP" value="http" />
                            <el-option label="HTTPS" value="https" />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                        :label="t('upstreams.checkPath')" prop="checks.active.http_path">
                        <el-input v-model="formData.checks.active.http_path" :placeholder="t('upstreams.httpPathPlaceholder')" />
                    </el-form-item>

                    <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                        :label="t('upstreams.checkHost')" prop="checks.active.host">
                        <el-input v-model="formData.checks.active.host" :placeholder="t('upstreams.httpHostPlaceholder')" />
                    </el-form-item>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="t('upstreams.checkPort')" prop="checks.active.port">
                                <el-input-number v-model="formData.checks.active.port" :min="1" :max="65535" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="t('upstreams.checkTimeout')" prop="checks.active.timeout">
                                <el-input-number v-model="formData.checks.active.timeout" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider>{{ t('upstreams.healthyTitle') }}</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item :label="t('upstreams.healthyInterval')" prop="checks.active.healthy.interval">
                                <el-input-number v-model="formData.checks.active.healthy.interval" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="t('upstreams.healthySuccesses')"
                                prop="checks.active.healthy.successes">
                                <el-input-number v-model="formData.checks.active.healthy.successes" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                                :label="t('upstreams.statusCodes')" prop="checks.active.healthy.status">
                                <el-select v-model="formData.checks.active.healthy.status" multiple
                                    :placeholder="t('upstreams.statusCodes')">
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

                    <el-divider>{{ t('upstreams.unhealthyTitle') }}</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item :label="t('upstreams.unhealthyInterval')"
                                prop="checks.active.unhealthy.interval">
                                <el-input-number v-model="formData.checks.active.unhealthy.interval" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.active.type)"
                                :label="t('upstreams.httpFailures')"
                                prop="checks.active.unhealthy.http_failures">
                                <el-input-number v-model="formData.checks.active.unhealthy.http_failures" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                            <el-form-item v-else :label="t('upstreams.tcpFailures')"
                                prop="checks.active.unhealthy.tcp_failures">
                                <el-input-number v-model="formData.checks.active.unhealthy.tcp_failures" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="t('upstreams.timeouts')"
                                prop="checks.active.unhealthy.timeouts">
                                <el-input-number v-model="formData.checks.active.unhealthy.timeouts" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>

                <el-form-item :label="t('upstreams.enablePassiveChecks')">
                    <el-switch v-model="enablePassiveChecks" />
                </el-form-item>

                <template v-if="enablePassiveChecks">
                    <el-divider content-position="left">{{ t('upstreams.passiveHealthCheck') }}</el-divider>

                    <el-form-item :label="t('upstreams.passiveType')" prop="checks.passive.type">
                        <el-select v-model="formData.checks.passive.type" :placeholder="t('upstreams.selectCheckType')">
                            <el-option label="HTTP" value="http" />
                            <el-option label="HTTPS" value="https" />
                        </el-select>
                    </el-form-item>

                    <el-divider>{{ t('upstreams.healthyTitle') }}</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="t('upstreams.passiveHealthySuccesses')"
                                prop="checks.passive.healthy.successes">
                                <el-input-number v-model="formData.checks.passive.healthy.successes" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                label="被动健康状态码" prop="checks.passive.healthy.status">
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

                    <el-divider>{{ t('upstreams.unhealthyTitle') }}</el-divider>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                :label="t('upstreams.passiveHttpFailures')"
                                prop="checks.passive.unhealthy.http_failures">
                                <el-input-number v-model="formData.checks.passive.unhealthy.http_failures" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                            <el-form-item v-else :label="t('upstreams.passiveTcpFailures')"
                                prop="checks.passive.unhealthy.tcp_failures">
                                <el-input-number v-model="formData.checks.passive.unhealthy.tcp_failures" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="t('upstreams.passiveTimeouts')"
                                prop="checks.passive.unhealthy.timeouts">
                                <el-input-number v-model="formData.checks.passive.unhealthy.timeouts" :min="1" controls-position="right" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item v-if="['http', 'https'].includes(formData.checks.passive.type)"
                                :label="t('upstreams.statusCodes')" prop="checks.passive.unhealthy.status">
                                <el-select v-model="formData.checks.passive.unhealthy.status" multiple
                                    :placeholder="t('upstreams.statusCodes')">
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
                    <span class="section-title">{{ t('form.timeoutConfig') }}</span>
                </template>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item :label="t('form.connectTimeout')" prop="timeout.connect">
                            <el-input-number v-model="formData.timeout.connect" :min="0" :step="1" controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('form.sendTimeout')" prop="timeout.send">
                            <el-input-number v-model="formData.timeout.send" :min="0" :step="1" controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="t('form.readTimeout')" prop="timeout.read">
                            <el-input-number v-model="formData.timeout.read" :min="0" :step="1" controls-position="right" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-row>

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

            <!-- 表单操作 -->
            <div class="form-actions">
                <el-button type="primary" @click="submitForm">{{ t('common.submit') }}</el-button>
                <el-button @click="resetForm">{{ t('common.reset') }}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, watch, defineProps, onMounted } from 'vue';
import { getNonEmptyValues } from "@/utils/index.js";
import { createUpstreams, getUpstreamsById, PatchUpstreams } from "@/api/index.js";
import { useI18nUtils } from '@/utils/i18n.js';
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
import { Delete } from '@element-plus/icons-vue';

// 导入自定义组件
import KeyValueInput from '@/components/KeyValueInput.vue';

// 表单引用
const formRef = ref();
const { t } = useI18nUtils();
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
        "127.0.0.1:8080": 1
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
/* 使用全局统一样式，无需额外CSS */
</style>