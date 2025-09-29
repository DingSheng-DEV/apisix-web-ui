<script setup>
import { ref, watch } from 'vue';
import { ElButton, ElInput } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useI18nUtils } from '@/utils/i18n.js';

const { t } = useI18nUtils();
const emit = defineEmits(['sendData'])
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({})
    },
    keyPlaceholder: {
        type: String,
        default: ""
    },
    valuePlaceholder: {
        type: String,
        default: ""
    }
});


const items = ref([]);
const updateItems = () => {
    items.value = Object.entries(props.modelValue).map(([key, value]) => ({
        key,
        value
    }));
};

const updateModel = () => {
    const newValue = {};
    items.value.forEach(item => {
        if (item.key) {
            newValue[item.key] = item.value || '';
        }
    });
};
const support = () => {
    emit('sendData', items.value) // 触发事件并传递数据
}

// 初始化
updateItems();

// 监听props变化
watch(() => props.modelValue, updateItems, { deep: true });

// 监听items变化
watch(items, updateModel, { deep: true });

const addItem = () => {
    items.value.push({ key: '', value: '' });
};

const removeItem = (index) => {
    items.value.splice(index, 1);
};
</script>

<template>
    <div class="key-value-input">
        <div class="key-value-input-header">
            <span style="margin-right: 16px;">{{ t('form.keyValueList') }}</span>
            <el-button type="text" @click="addItem">{{ t('form.addItem') }}</el-button>
            <el-button type="text" @click="support">{{ t('form.save') }}</el-button>
        </div>

        <div class="key-value-input-items" v-show="items.length !== 0">
            <div v-for="(item, index) in items" :key="index" class="key-value-input-item">
                <el-input v-model="item.key" :placeholder="keyPlaceholder || '键'" />
                <el-input v-model="item.value" :placeholder="valuePlaceholder || '值'" />
                <el-button type="danger" text @click="removeItem(index)" :icon="Delete" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.key-value-input {
    margin-bottom: 16px;
}

.key-value-input-header {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;
}

.key-value-input-items {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 8px;
}

.key-value-input-item {
    display: flex;
    margin-bottom: 8px;
}

.key-value-input-item:last-child {
    margin-bottom: 0;
}

.key-value-input-item .el-input {
    flex: 1;
    margin-right: 8px;
}
</style>