<template>
    <div class="ssl-form-container">
        <el-form :model="formData" label-width="120px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                    <button @click="text" type="button">a</button>
                </template>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="证书类型" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="server">服务端证书</el-radio>
                        <el-radio label="client">客户端证书</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-card>

            <!-- 证书配置部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">证书配置（必填）</span>
                </template>

                <el-form-item label="证书内容" prop="cert">
                    <el-input v-model="formData.cert" type="textarea" :rows="5" placeholder="请输入PEM格式的证书内容" />
                </el-form-item>

                <el-form-item label="私钥内容" prop="key">
                    <el-input v-model="formData.key" type="textarea" :rows="5" placeholder="请输入PEM格式的私钥内容" />
                </el-form-item>

                <array-input v-model="formData.snis" label="SNI列表（必填）" placeholder="例如: example.com" />

                <el-divider content-position="left">额外证书（可选）</el-divider>

                <el-form-item label="额外证书" prop="certs">
                    <el-button type="primary" @click="addExtraCert" plain size="small">添加额外证书</el-button>
                </el-form-item>

                <div v-for="(cert, index) in formData.certs" :key="'cert-' + index" class="extra-cert-item">
                    <el-divider content-position="left">额外证书 #{{ index + 1 }}</el-divider>
                    <el-form-item :label="'证书内容 #' + (index + 1)" :prop="'certs.' + index">
                        <div class="cert-input-group">
                            <el-input v-model="formData.certs[index]" type="textarea" :rows="3"
                                placeholder="请输入PEM格式的证书内容" />
                            <el-button type="danger" @click="removeExtraCert(index)" icon="Delete" circle />
                        </div>
                    </el-form-item>
                    <el-form-item :label="'私钥内容 #' + (index + 1)" :prop="'keys.' + index">
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

                <el-form-item label="客户端CA证书" prop="client.ca">
                    <el-input v-model="formData.client.ca" type="textarea" :rows="5" placeholder="请输入用于客户端证书校验的CA证书" />
                </el-form-item>

                <el-form-item label="验证深度" prop="client.depth">
                    <el-input-number v-model="formData.client.depth" :min="0" :max="10" />
                </el-form-item>

                <array-input v-model="formData.client.skip_mtls_uri_regex" label="跳过MTLS的URI正则"
                    placeholder="例如: /api/public/.*" />
            </el-card>

            <!-- 高级配置 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">高级配置</span>
                </template>

                <array-input v-model="formData.ssl_protocols" label="SSL协议版本" placeholder="例如: TLSv1.2"
                    :options="sslProtocolOptions" />

                <el-form-item label="标签" prop="labels">
                    <key-value-input @send-data="updateLabels" v-model="formData.labels" />
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
let initialFormData = {
    cert: "",
    key: "",
    cert: keys.public,
    key: keys.private,
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
let formData = reactive(JSON.parse(JSON.stringify(initialFormData)));
const props = defineProps({
    patch: {
        type: String,
        default: "",
    },
});

// 监听patch属性变化，加载已有SSL数据
watch(() => props.patch, (newValue) => {

    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)))
        return;
    }
    getSslsById(newValue).then((res) => {
        console.log(res.data.value);
        for (const key of Object.keys(res.data.value)) {
            if (key in formData) {
                formData[key] = res.data.value[key];
            } else if (key === "client" && typeof res.data.value.client === "object") {
                // 处理嵌套的client对象
                for (const clientKey of Object.keys(res.data.value.client)) {
                    if (clientKey in formData.client) {
                        formData.client[clientKey] = res.data.value.client[clientKey];
                    }
                }
            }
        }
    });
}, { immediate: true });

// 表单引用
const formRef = ref();

// 更新标签
const updateLabels = (data) => {
    formData.labels = {};
    for (let item of data) {
        formData.labels[item.key] = item.value;
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
    formData.certs.push("");
    formData.keys.push("");
};

// 移除额外证书
const removeExtraCert = (index) => {
    formData.certs.splice(index, 1);
    formData.keys.splice(index, 1);
};

const text = () => {
    let a = {
        "cert": keys.public,
        "key": keys.private,
        "snis": ["example.com"]
    }
    let id = 1

    createSsls(a, id).then((res) => {
        ElMessage.success("SSL证书创建成功");
        console.log(res);
    }).catch(err => {
        ElMessage.error("SSL证书创建失败: " + err.message);
    });
}

// 提交表单
const submitForm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            const data = getNonEmptyValues(formData);
            let { cert, key, snis } = data;
            if (props.patch !== "") {
                PatchSsls({ cert, key, snis }, props.patch).then((res) => {
                    ElMessage.success("SSL证书更新成功");
                    console.log(res);
                }).catch(err => {
                    ElMessage.error("SSL证书更新失败: " + err.message);
                });
                return;
            }


            // 生成随机ID或使用其他逻辑获取ID
            const id = Date.now().toString();
            createSsls({ cert, key, snis }, id).then((res) => {
                ElMessage.success("SSL证书创建成功");
                console.log(res);
            }).catch(err => {
                ElMessage.error("SSL证书创建失败: " + err.message);
            });
        } else {
            ElMessage.error("表单验证失败，请检查必填项");
            return false;
        }
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
</style>
