<template>
  <div class="i18n-demo-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>{{ t('common.appTitle') }}</h2>
          <LanguageSwitcher />
        </div>
      </template>
      
      <div class="demo-content">
        <h3>{{ t('nav.resourceConfig') }}</h3>
        <el-space wrap>
          <el-tag v-for="item in resourceItems" :key="item.key" type="primary">
            {{ t(item.key) }}
          </el-tag>
        </el-space>

        <h3>{{ t('nav.globalConfig') }}</h3>
        <el-space wrap>
          <el-tag v-for="item in globalItems" :key="item.key" type="success">
            {{ t(item.key) }}
          </el-tag>
        </el-space>

        <h3>{{ t('common.actions') || '操作' }}</h3>
        <el-space>
          <el-button type="primary">{{ t('common.save') }}</el-button>
          <el-button>{{ t('common.cancel') }}</el-button>
          <el-button type="danger">{{ t('common.delete') }}</el-button>
        </el-space>

        <h3>{{ t('messages.status') || '状态消息' }}</h3>
        <el-space direction="vertical" style="width: 100%">
          <el-alert :title="t('messages.createSuccess')" type="success" />
          <el-alert :title="t('messages.updateSuccess')" type="info" />
          <el-alert :title="t('messages.operationFailed')" type="error" />
        </el-space>

        <h3>{{ t('settings.language') }}</h3>
        <p>{{ t('common.currentLanguage') || '当前语言' }}: {{ getLanguageName() }}</p>
        <p>{{ t('common.isZhCN') || '是否中文' }}: {{ isZhCN() ? t('common.yes') : t('common.no') }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElCard, ElTag, ElSpace, ElButton, ElAlert } from 'element-plus'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18nUtils } from '@/utils/i18n.js'

const { t, isZhCN, getLanguageName } = useI18nUtils()

const resourceItems = ref([
  { key: 'nav.routes' },
  { key: 'nav.services' },
  { key: 'nav.upstreams' },
])

const globalItems = ref([
  { key: 'nav.ssl' },
  { key: 'nav.globalRules' },
])
</script>

<style scoped>
.i18n-demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #2c3e50;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-content h3 {
  margin: 0;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}
</style>
