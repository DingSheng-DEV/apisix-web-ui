<template>
    <div class="ssl-form-container">
        <el-form :model="formData" label-width="120px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>

                <el-form-item label="id" prop="id" disabled>
                    <el-input v-model="formData.id" placeholder="请输入SSL证书ID（可选）" />
                    <span class="form-item-tip">系统自动生成</span>
                </el-form-item>

                <el-form-item label="status" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="type" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="server">服务器证书</el-radio>
                        <el-radio label="client">客户端证书</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-card>

            <!-- 证书配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">证书配置（必填）</span>
                </template>

                <el-form-item label="cert" prop="cert" required>
                    <el-input v-model="formData.cert" type="textarea" :rows="5" placeholder="请输入PEM格式的证书内容" />
                    <span class="form-item-tip">PEM格式的SSL证书内容</span>
                </el-form-item>

                <el-form-item label="key" prop="key" required>
                    <el-input v-model="formData.key" type="textarea" :rows="5" placeholder="请输入PEM格式的私钥内容" />
                    <span class="form-item-tip">PEM格式的SSL私钥内容</span>
                </el-form-item>

                <el-form-item label="snis" prop="snis" required>
                    <array-input v-model="formData.snis" placeholder="例如: example.com" />
                    <span class="form-item-tip">服务器名称指示列表，当类型为'server'时必填</span>
                </el-form-item>

                <el-divider content-position="left">额外证书（可选）</el-divider>

                <el-form-item label="certs & keys">
                    <el-button type="primary" @click="addExtraCert" plain size="small">添加额外证书</el-button>
                    <span class="form-item-tip">为同一个SNI添加多个证书</span>
                </el-form-item>

                <div v-for="(cert, index) in formData.certs" :key="'cert-' + index" class="extra-cert-item">
                    <el-divider content-position="left">额外证书 #{{ index + 1 }}</el-divider>
                    <el-form-item :label="'cert #' + (index + 1)" :prop="'certs.' + index">
                        <div class="cert-input-group">
                            <el-input v-model="formData.certs[index]" type="textarea" :rows="3"
                                placeholder="请输入PEM格式的证书内容" />
                            <el-button type="danger" @click="removeExtraCert(index)" icon="Delete" circle />
                        </div>
                    </el-form-item>
                    <el-form-item :label="'key #' + (index + 1)" :prop="'keys.' + index">
                        <el-input v-model="formData.keys[index]" type="textarea" :rows="3"
                            placeholder="请输入PEM格式的私钥内容" />
                    </el-form-item>
                </div>
            </el-card>

            <!-- 客户端证书验证配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">客户端证书验证配置（可选）</span>
                </template>

                <el-form-item label="client.ca" prop="client.ca">
                    <el-input v-model="formData.client.ca" type="textarea" :rows="5" placeholder="请输入用于客户端证书验证的CA证书" />
                    <span class="form-item-tip">用于客户端证书验证的CA证书</span>
                </el-form-item>

                <el-form-item label="client.depth" prop="client.depth">
                    <el-input-number v-model="formData.client.depth" :min="0" :max="10" />
                    <span class="form-item-tip">客户端证书的最大验证深度</span>
                </el-form-item>

                <el-form-item label="匹配请求表达式" prop="client.skip_mtls_uri_regex">
                    <array-input v-model="formData.client.skip_mtls_uri_regex" placeholder="例如: /api/public/.*" />
                    <span class="form-item-tip">跳过mTLS认证的URI正则表达式模式</span>
                </el-form-item>
            </el-card>

            <!-- 高级配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">高级配置</span>
                </template>

                <el-form-item label="ssl_protocols" prop="ssl_protocols">
                    <array-input v-model="formData.ssl_protocols" placeholder="例如: TLSv1.2"
                        :options="sslProtocolOptions" />
                    <span class="form-item-tip">支持的SSL协议版本</span>
                </el-form-item>

                <el-form-item label="labels" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" key-placeholder="键"
                        value-placeholder="值" />
                    <span class="form-item-tip">SSL证书的自定义标签</span>
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
import { ref, reactive, defineProps, watch } from "vue";
import { getSslsById } from "@/api/module/ssl.js";
import keys from "../../../public/keys.js";
import {
    ElButton,
    ElCard,
    ElInput,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElRadioGroup,
    ElRadio,
    ElDivider,
    ElMessage,
} from "element-plus";

// 导入自定义组件
import ArrayInput from "@/components/ArrayInput.vue";
import KeyValueInput from "@/components/KeyValueInput.vue";
import { createSsls, PatchSsls } from "@/api/module/ssl.js";
import { getNonEmptyValues } from "@/utils/index.js";

// 初始表单数据
const initialFormData = {
    id: "",
    cert: keys.public,
    key: keys.private,
    certs: [],
    keys: [],
    snis: ["example.com"],
    type: "server",
    status: 1,
    ssl_protocols: [],
    labels: {},
    client: {
        ca: "",
        depth: 1,
        skip_mtls_uri_regex: []
    }
};

// 表单数据
const formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 表单引用
const formRef = ref();

const props = defineProps({
    patch: {
        type: String,
        default: "",
    },
});

// 监听patch属性变化，加载已有SSL数据
watch(() => props.patch, (newValue) => {
    // 重置表单数据
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
        return;
    }

    // 获取SSL证书详情
    getSslsById(newValue).then((res) => {
        const sslData = res.data.value;

        // 重置表单
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));

        // 设置基本字段
        for (const key of Object.keys(sslData)) {
            if (key in formData) {
                formData[key] = sslData[key];
            } else if (key === "client" && typeof sslData.client === "object") {
                // 处理嵌套的client对象
                for (const clientKey of Object.keys(sslData.client)) {
                    if (clientKey in formData.client) {
                        formData.client[clientKey] = sslData.client[clientKey];
                    }
                }
            }
        }
    }).catch(err => {
        ElMessage.error("Failed to load SSL certificate: " + err.message);
    });
}, { immediate: true });

// 更新标签
const updateLabels = (data) => {
    formData.labels = {};
    for (const item of data) {
        if (item.key && item.value) {
            formData.labels[item.key] = item.value;
        }
    }
};

// SSL协议选项
const sslProtocolOptions = ref([
    "TLSv1",
    "TLSv1.1",
    "TLSv1.2",
    "TLSv1.3",
]);

// 添加额外证书
const addExtraCert = () => {
    if (!formData.certs) {
        formData.certs = [];
    }
    if (!formData.keys) {
        formData.keys = [];
    }
    formData.certs.push("");
    formData.keys.push("");
};

// 移除额外证书
const removeExtraCert = (index) => {
    formData.certs.splice(index, 1);
    formData.keys.splice(index, 1);
};

// 提交表单
const submitForm = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            ElMessage.error("表单验证失败，请检查必填字段");
            return false;
        }

        // 获取非空值
        const { client, ...data } = getNonEmptyValues(formData);
        console.log(data);

        // 检查必填字段
        if (!data.cert) {
            ElMessage.error("证书内容为必填项");
            return false;
        }

        if (!data.key) {
            ElMessage.error("私钥内容为必填项");
            return false;
        }

        if (data.type === 'server' && (!data.snis || data.snis.length === 0)) {
            ElMessage.error("服务器证书需要SNI列表");
            return false;
        }

        // 更新现有SSL证书
        if (props.patch !== "") {
            PatchSsls(data, props.patch).then((res) => {
                ElMessage.success("SSL证书更新成功");
                console.log(res);
            }).catch(err => {
                ElMessage.error("SSL证书更新失败: " + err.message);
            });
            return;
        }

        // 创建新的SSL证书

        const id = data.id || Date.now().toString();
        createSsls(data).then((res) => {
            ElMessage.success("SSL证书创建成功");
            resetForm();
        }).catch(err => {
            ElMessage.error("SSL证书创建失败: " + err.message);
        });
    });
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
};
</script>

<style scoped>
.ssl-form-container {
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

.extra-cert-item {
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;
}

.cert-input-group {
    display: flex;
    align-items: flex-start;
}

.cert-input-group .el-input {
    flex: 1;
    margin-right: 10px;
}

.form-item-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
}
</style>
