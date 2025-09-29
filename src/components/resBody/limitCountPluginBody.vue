<template>
    <div class="form-container">
        <el-form :model="formData" label-width="140px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>
                <el-form-item label="规则ID">
                    <el-input v-model="formData.id" disabled />
                </el-form-item>
            </el-card>

            <!-- 限流插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <div class="plugin-header">
                        <span class="section-title">限流插件配置 (limit-count)</span>
                        <el-switch v-model="formData.enableLimitCount" />
                    </div>
                </template>

                <template v-if="formData.enableLimitCount">
                    <el-form-item label="计数器窗口时间(秒)" prop="plugins.limit-count.time_window">
                        <el-input-number v-model="formData.plugins['limit-count'].time_window" :min="1" :max="3600"
                            placeholder="请输入时间窗口大小(秒)" />
                    </el-form-item>

                    <el-form-item label="请求数量限制" prop="plugins.limit-count.count">
                        <el-input-number v-model="formData.plugins['limit-count'].count" :min="1"
                            placeholder="请输入时间窗口内允许的请求数量" />
                    </el-form-item>

                    <el-form-item label="限流策略" prop="plugins.limit-count.policy">
                        <el-select v-model="formData.plugins['limit-count'].policy" placeholder="请选择限流策略">
                            <el-option label="本地模式(local)" value="local" />
                            <el-option label="Redis模式(redis)" value="redis" />
                            <el-option label="Redis集群模式(redis-cluster)" value="redis-cluster" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="限流键" prop="plugins.limit-count.key">
                        <el-select v-model="formData.plugins['limit-count'].key" placeholder="请选择限流键">
                            <el-option label="客户端IP(remote_addr)" value="remote_addr" />
                            <el-option label="服务器IP(server_addr)" value="server_addr" />
                            <el-option label="请求路径(uri)" value="uri" />
                            <el-option label="消费者ID(consumer_name)" value="consumer_name" />
                            <el-option label="服务ID(service_id)" value="service_id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="拒绝状态码" prop="plugins.limit-count.rejected_code">
                        <el-input-number v-model="formData.plugins['limit-count'].rejected_code" :min="200" :max="599"
                            placeholder="请输入超出限制时返回的HTTP状态码" />
                    </el-form-item>

                    <el-form-item label="拒绝消息" prop="plugins.limit-count.rejected_msg">
                        <el-input v-model="formData.plugins['limit-count'].rejected_msg"
                            placeholder="请输入超出限制时返回的错误消息" />
                    </el-form-item>

                    <el-form-item label="允许降级" prop="plugins.limit-count.allow_degradation">
                        <el-switch v-model="formData.plugins['limit-count'].allow_degradation" />
                        <span class="form-item-tip">当限流插件功能临时不可用时，是否允许请求继续</span>
                    </el-form-item>
                </template>
                <el-alert v-else title="请启用限流插件进行配置" type="info" :closable="false" show-icon />
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
import {
    ElButton,
    ElCard,
    ElInput,
    ElInputNumber,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElSwitch,
    ElMessage,
    ElAlert,
} from "element-plus";
import { getGlobal_rulesById, createGlobal_rules, PatchGlobal_rules } from "@/api/module/rules.js";
import { getNonEmptyValues } from "@/utils/index.js";

// 表单引用
const formRef = ref();

// Props 定义
const props = defineProps({
    patch: {
        type: String,

    },
    total: {
        type: Number,
    },
});

// 初始表单数据
let initialFormData = {
    enableLimitCount: true,
    plugins: {
        "limit-count": {
            time_window: 1,
            policy: "local",
            count: 1,
            key: "remote_addr",
            rejected_code: 503,
            rejected_msg: "",
            allow_degradation: false
        }
    }
};

// 表单数据
let formData = reactive(JSON.parse(JSON.stringify(initialFormData)));

// 监听 patch 属性变化，加载已有数据
watch(() => props.patch, (newValue) => {
    if (newValue === "") {
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)))

        return;
    }


    getGlobal_rulesById(newValue).then((res) => {
        console.log(res.data.value);

        // 重置表单
        Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));

        // 填充数据
        if (res.data.value.id) {
            formData.id = res.data.value.id;
        }

        if (res.data.value.priority !== undefined) {
            formData.priority = res.data.value.priority;
        }

        // 处理插件数据
        if (res.data.value.plugins && res.data.value.plugins['limit-count']) {
            formData.enableLimitCount = true;
            const limitCount = res.data.value.plugins['limit-count'];

            for (const key in limitCount) {
                if (formData.plugins['limit-count'][key] !== undefined) {
                    formData.plugins['limit-count'][key] = limitCount[key];
                }
            }
        } else {
            formData.enableLimitCount = false;
        }
    }).catch(err => {
        ElMessage.error("获取数据失败: " + err.message);
    });
}, { immediate: true });

// 提交表单
const submitForm = () => {
    let total = props.total
    total += 1
    formRef.value.validate((valid) => {
        if (valid) {
            // 构建提交数据
            const submitData = {
                plugins: {}
            };

            // 只有启用了限流插件才添加相关配置
            if (formData.enableLimitCount) {
                submitData.plugins['limit-count'] = { ...formData.plugins['limit-count'] };

                // 移除空值
                for (const key in submitData.plugins['limit-count']) {
                    if (submitData.plugins['limit-count'][key] === "" ||
                        submitData.plugins['limit-count'][key] === null ||
                        submitData.plugins['limit-count'][key] === undefined) {
                        delete submitData.plugins['limit-count'][key];
                    }
                }
            }

            if (props.patch) {
                // 更新现有规则
                PatchGlobal_rules(submitData, props.patch).then(res => {
                    ElMessage.success("规则更新成功");
                    console.log(res);
                }).catch(err => {
                    ElMessage.error("规则更新失败: " + err.message);
                });
            } else {
                // 创建新规则
                createGlobal_rules(submitData, total).then(res => {
                    ElMessage.success("规则创建成功");
                    console.log(res);
                }).catch(err => {
                    ElMessage.error("规则创建失败: " + err.message);
                });
            }
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
.plugin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
