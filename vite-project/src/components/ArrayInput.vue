<script setup>
import { ElButton, ElInput, ElSelect, ElOption } from 'element-plus';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true,
        default: () => []
    },
    label: {
        type: String,
        default: '列表'
    },
    placeholder: {
        type: String,
        default: '请输入'
    },
    options: {
        type: Array,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const addItem = () => {
    emit('update:modelValue', [...props.modelValue, '']);
};

const removeItem = (index) => {
    const newValue = [...props.modelValue];
    newValue.splice(index, 1);
    emit('update:modelValue', newValue);
};
</script>

<template>
    <div class="array-input">
        <div class="array-input-header">
            <span>{{ label }}</span>
            <el-button type="text" @click="addItem" icon="el-icon-plus">添加</el-button>
        </div>

        <div class="array-input-items">
            <div v-for="(item, index) in modelValue" :key="index" class="array-input-item">
                <el-input v-if="!options" v-model="modelValue[index]" :placeholder="placeholder" />

                <el-select v-else v-model="modelValue[index]" :placeholder="placeholder" filterable allow-create>
                    <el-option v-for="opt in options" :key="opt" :label="opt" :value="opt" />
                </el-select>

                <el-button type="danger" text @click="removeItem(index)" icon="el-icon-delete" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.array-input {
    margin-bottom: 16px;
}

.array-input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;
}

.array-input-items {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 8px;
}

.array-input-item {
    display: flex;
    margin-bottom: 8px;
}

.array-input-item:last-child {
    margin-bottom: 0;
}

.array-input-item .el-input,
.array-input-item .el-select {
    flex: 1;
    margin-right: 8px;
}
</style>