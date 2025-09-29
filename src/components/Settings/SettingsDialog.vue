<template>
  <el-dialog v-model="dialogVisible" :title="t('settings.title') || '系统设置'" width="600px" :before-close="handleClose" top="10vh">
    <div class="settings-container">
      <!-- API配置卡片 -->
      <el-card class="settings-card">
        <template #header>
          <div class="card-header">
            <span>{{ t('settings.apisixConfig') || 'API 配置' }}</span>
            <el-button type="primary" size="small" @click="showAddDialog">
              <el-icon>
                <Plus />
              </el-icon>
              {{ t('settings.addConfig') || t('common.add') }}
            </el-button>
          </div>
        </template>
        <el-form :model="form" label-width="120px" label-position="left">
          <el-form-item :label="t('settings.apiUrl') || 'API地址'">
            <el-select v-model="form.api" :placeholder="t('settings.selectApiUrl') || t('settings.apiUrl')" clearable filterable allow-create style="width: 100%">
              <el-option v-for="item in apiOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('settings.port') || '端口'">
            <el-select v-model="form.port" :placeholder="t('settings.selectPort') || t('settings.port')" clearable filterable allow-create style="width: 100%">
              <el-option v-for="item in portOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('settings.token') || 'Token'">
            <el-select v-model="form.token" :placeholder="t('settings.selectToken') || t('settings.token')" clearable filterable allow-create
              style="width: 100%">
              <el-option v-for="item in tokenOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveSettings">
          {{ t('common.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加配置弹窗 -->
  <el-dialog v-model="addDialogVisible" :title="t('settings.addApiConfig') || '添加 API 配置'" width="500px" :before-close="handleAddDialogClose">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px" label-position="left">
      <el-form-item :label="t('settings.apiUrl') || 'API地址'" prop="api">
        <el-input v-model="addForm.api" :placeholder="t('settings.inputApi') || t('settings.apiUrl')" clearable />
      </el-form-item>
      <el-form-item :label="t('settings.port') || '端口'" prop="port">
        <el-input v-model="addForm.port" :placeholder="t('settings.inputPort') || t('settings.port')" clearable />
      </el-form-item>
      <el-form-item :label="t('settings.token') || 'Token'" prop="token">
        <el-input v-model="addForm.token" :placeholder="t('settings.inputToken') || t('settings.token')" clearable show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleAddDialogClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addConfiguration">
          {{ t('common.add') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from 'vue';
import { ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElButton, ElMessage, ElCard, ElInput, ElIcon } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { apiConfig, updateConfig } from '@/utils/config.js';
import { useI18nUtils } from '@/utils/i18n.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'saved']);

// i18n相关
const { t } = useI18nUtils();

// 下拉框选项数据
const apiOptions = ref([
  { label: '192.168.3.125', value: '192.168.3.125' },
  { label: '127.0.0.1', value: '127.0.0.1' },
  { label: 'localhost', value: 'localhost' }
]);

const portOptions = ref([
  { label: '9180', value: '9180' },
  { label: '9080', value: '9080' },
  { label: '8080', value: '8080' }
]);

const tokenOptions = ref([
  { label: 'edd1c9f034335f136f87ad84b625c8f1', value: 'edd1c9f034335f136f87ad84b625c8f1' },
  { label: 'admin-token', value: 'admin-token' },
  { label: 'test-token', value: 'test-token' }
]);

// 对话框可见性
const dialogVisible = ref(props.visible);

// 添加配置弹窗相关
const addDialogVisible = ref(false);
const addFormRef = ref(null);

// 添加配置表单数据
const addForm = reactive({
  api: '',
  port: '',
  token: ''
});

// 添加配置表单验证规则
const addFormRules = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' }
  ],
  api: [
    { required: true, message: '请输入API地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { pattern: /^\d+$/, message: '端口号必须为数字', trigger: 'blur' }
  ],
  token: [
    { required: true, message: '请输入Token', trigger: 'blur' }
  ]
};

// 监听props.visible的变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    // 当对话框打开时，初始化表单数据
    form.api = apiConfig.api;
    form.port = apiConfig.port;
    form.token = apiConfig.token;
  }
});

// 监听dialogVisible的变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

// 表单数据
const form = reactive({
  api: apiConfig.api,
  port: apiConfig.port,
  token: apiConfig.token
});

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 保存设置
const saveSettings = () => {
  // 更新配置
  updateConfig({
    api: form.api,
    port: form.port,
    token: form.token
  });

  // 提示保存成功
  ElMessage({
    type: 'success',
    message: '设置已保存'
  });

  // 关闭对话框
  dialogVisible.value = false;

  // 触发保存事件
  emit('saved', {
    api: form.api,
    port: form.port,
    token: form.token
  });
};

// 显示添加配置弹窗
const showAddDialog = () => {
  addDialogVisible.value = true;
  // 重置表单
  Object.assign(addForm, {
    api: '',
    port: '',
    token: ''
  });
  // 清除验证
  if (addFormRef.value) {
    addFormRef.value.clearValidate();
  }
};

// 关闭添加配置弹窗
const handleAddDialogClose = () => {
  addDialogVisible.value = false;
};

// 添加配置
const addConfiguration = async () => {
  if (!addFormRef.value) return;

  try {
    // 验证表单
    await addFormRef.value.validate();

    // 检查是否已存在相同的配置
    const existingApi = apiOptions.value.find(item => item.value === addForm.api);
    const existingPort = portOptions.value.find(item => item.value === addForm.port);
    const existingToken = tokenOptions.value.find(item => item.value === addForm.token);

    // 添加到对应的选项列表中（如果不存在）
    if (!existingApi) {
      apiOptions.value.push({
        label: addForm.api,
        value: addForm.api
      });
    }

    if (!existingPort) {
      portOptions.value.push({
        label: addForm.port,
        value: addForm.port
      });
    }

    if (!existingToken) {
      tokenOptions.value.push({
        label: addForm.token,
        value: addForm.token
      });
    }

    // 提示添加成功
    ElMessage({
      type: 'success',
      message: '配置添加成功'
    });

    // 关闭弹窗
    addDialogVisible.value = false;

  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 组件挂载时初始化表单数据
onMounted(() => {
  form.api = apiConfig.api;
  form.port = apiConfig.port;
  form.token = apiConfig.token;
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.settings-container {
  padding: 10px;
}

.settings-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  background-color: #f5f7fa;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
