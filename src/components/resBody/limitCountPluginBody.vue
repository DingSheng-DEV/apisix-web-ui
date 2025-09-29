<template>
    <div class="form-container">
        <el-form :model="formData" label-width="140px" ref="formRef">
            <!-- 基本信息部分 -->
            <el-card class="form-section">
                <template #header>
                    <span class="section-title">{{ t('form.basicInfo') }}</span>
                </template>
                <el-form-item :label="t('form.ruleId')">
                    <el-input v-model="formData.id" disabled />
                </el-form-item>
            </el-card>

            <!-- 限流插件配置 -->
            <el-card class="form-section">
                <template #header>
                    <div class="plugin-header">
                        <span class="section-title">{{ t('form.limitCountPlugin') }}</span>
                        <el-switch v-model="formData.enableLimitCount" />
                    </div>
                </template>

                <template v-if="formData.enableLimitCount">
                    <el-form-item :label="t('form.countWindowTime')" prop="plugins.limit-count.time_window">
                        <el-input-number v-model="formData.plugins['limit-count'].time_window" :min="1" :max="3600"
                            controls-position="right" style="width: 100%;" />
                    </el-form-item>

                    <el-form-item :label="t('form.requestLimit')" prop="plugins.limit-count.count">
                        <el-input-number v-model="formData.plugins['limit-count'].count" :min="1"
                            controls-position="right" style="width: 100%;" />
                    </el-form-item>

                    <el-form-item :label="t('form.limitPolicy')" prop="plugins.limit-count.policy">
                        <el-select v-model="formData.plugins['limit-count'].policy" :placeholder="t('tips.selectLimitPolicy')">
                            <el-option :label="t('form.localMode')" value="local" />
                            <el-option :label="t('form.redisMode')" value="redis" />
                            <el-option :label="t('form.redisClusterMode')" value="redis-cluster" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.limitKey')" prop="plugins.limit-count.key">
                        <el-select v-model="formData.plugins['limit-count'].key" :placeholder="t('tips.selectLimitKey')">
                            <el-option :label="t('form.clientIp')" value="remote_addr" />
                            <el-option :label="t('form.serverIp')" value="server_addr" />
                            <el-option :label="t('form.requestPath')" value="uri" />
                            <el-option :label="t('form.consumerId')" value="consumer_name" />
                            <el-option :label="t('form.serviceId')" value="service_id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="t('form.rejectedCode')" prop="plugins.limit-count.rejected_code">
                        <el-input-number v-model="formData.plugins['limit-count'].rejected_code" :min="200" :max="599"
                            controls-position="right" style="width: 100%;" />
                    </el-form-item>

                    <el-form-item :label="t('form.rejectedMsg')" prop="plugins.limit-count.rejected_msg">
                        <el-input v-model="formData.plugins['limit-count'].rejected_msg"
                            :placeholder="t('form.enterRejectedMsg')" />
                    </el-form-item>

                    <el-form-item :label="t('form.allowDegradation')" prop="plugins.limit-count.allow_degradation">
                        <el-switch v-model="formData.plugins['limit-count'].allow_degradation" />
                        <span class="form-item-tip">{{ t('form.degradationTip') }}</span>
                    </el-form-item>
                </template>
                <el-alert v-else :title="t('form.enableLimitPlugin')" type="info" :closable="false" show-icon />
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
import { useI18nUtils } from '@/utils/i18n.js';

// 表单引用
const formRef = ref();
const { t } = useI18nUtils();

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
        ElMessage.error(t('messages.operationFailed') + ': ' + err.message);
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
                    ElMessage.success(t('messages.updateSuccess'));
                    console.log(res);
                }).catch(err => {
                    ElMessage.error(t('messages.operationFailed') + ': ' + err.message);
                });
            } else {
                // 创建新规则
                createGlobal_rules(submitData, total).then(res => {
                    ElMessage.success(t('messages.createSuccess'));
                    console.log(res);
                }).catch(err => {
                    ElMessage.error(t('messages.operationFailed') + ': ' + err.message);
                });
            }
        } else {
            ElMessage.error(t('tips.formValidationFailed'));
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
