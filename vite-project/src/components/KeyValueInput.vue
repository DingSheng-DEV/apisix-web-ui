<script setup>
import { ref, watch } from 'vue';
import { ElButton, ElInput } from 'element-plus';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({})
    },
    keyPlaceholder: {
        type: String,
        default: '键'
    },
    valuePlaceholder: {
        type: String,
        default: '值'
    }
});

const emit = defineEmits(['update:modelValue']);

const items = ref([]);

// 将对象转换为数组
const updateItems = () => {
    items.value = Object.entries(props.modelValue).map(([key, value]) => ({
        key,
        value
    }));
};

// 将数组转换为对象
const updateModel = () => {
    const newValue = {};
    items.value.forEach(item => {
        if (item.key) {
            newValue[item.key] = item.value || '';
        }
    });
    emit('update:modelValue', newValue);
};

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
            <span>键值对列表</span>
            <el-button type="text" @click="addItem" icon="el-icon-plus">添加</el-button>
        </div>

        <div class="key-value-input-items">
            <div v-for="(item, index) in items" :key="index" class="key-value-input-item">
                <el-input v-model="item.key" :placeholder="keyPlaceholder" />
                <el-input v-model="item.value" :placeholder="valuePlaceholder" />
                <el-button type="danger" text @click="removeItem(index)" icon="el-icon-delete" />
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
    justify-content: space-between;
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