<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, inject, watch, onMounted } from "vue";
import global_rules_Body from "@/components/resBody/limitCountPluginBody.vue";

import { getGlobal_rules, getGlobal_rulesById, createGlobal_rules, PatchGlobal_rules, DeleteGlobal_rules } from "@/api/module/rules.js";
const tableList = ref([])
const apiType = inject('apiType');
const empty = ref(false);
watch(apiType, (newValue) => {
});
const dialogVisible = ref(false)
const total = ref(0)
const searchId = ref('')
const patch = ref("");

const reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}

const loadList = () => {
    tableList.value = [];
    getGlobal_rules().then((res) => {
        total.value = res.data.list.length
        console.log(total.value);
        for (let item of res.data.list) {
            let { plugins, id } = item.value;
            if (Object.keys(plugins).length === 0) {
                tableList.value.push({ id })
                continue
            }
            let { ["limit-count"]: limit_count } = plugins;

            let { time_window, policy, key, rejected_code } = limit_count;

            tableList.value.push({ policy, id, key, rejected_code, time_window })
        }
        if (tableList.value.length === 0) {
            empty.value = true
        }
    });
}

const search = (id) => {
    if (id === '') {
        loadList()
        return
    }
    tableList.value = [];
    getGlobal_rulesById(id).then((res) => {
        let { plugins, id } = res.data.value;
        if (Object.keys(plugins).length === 0) {
            tableList.value.push({ id })
            return
        }
        let { ["limit-count"]: limit_count } = plugins;
        let { time_window, policy, key, rejected_code } = limit_count;

        tableList.value.push({ policy, id, key, rejected_code, time_window })
    }).catch(() => {
        if (tableList.value.length === 0) {
            empty.value = true
        }
    })

}


const handleDelete = (event) => {
    DeleteGlobal_rules(event.row.id).then((res) => {
        console.log(res);
    });
    reflashList(event.$index)
}

const handleClose = () => {
    loadList()
    dialogVisible.value = false
}

const handlePatch = (event) => {
    patch.value = event.row.id
    dialogVisible.value = true
}

onMounted(() => {
    loadList()

})


const onBeforeSubmit = (index) => {
    patch.value = ""
    dialogVisible.value = true
}

const onSubmit = () => {
    dialogVisible.value = false
}
</script>

<template>
    <div>
        <div style="display: flex; flex-direction: column; width: 100%;">
            <el-card style="width: 100%;height: 80px;">
                <div style="display: flex;">
                    <el-input v-model="searchId" placeholder="根据id获取资源" class="input-with-select"
                        style="width: 25%;margin-right: 6px;">
                        <template #prepend>
                            <el-button :icon="Search" @click="search(searchId)" />
                        </template>
                    </el-input>
                    <el-button type="primary" @click="onBeforeSubmit(index)">创建资源</el-button>
                </div>
            </el-card>
            <el-card style="margin-top: 10px;overflow: auto;">
                <el-empty description="数据暂无" v-if="tableList.length === 0" />
                <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
                    <el-table-column prop="id" label="ID" />
                    <el-table-column prop="policy" label="策略" />
                    <el-table-column prop="key" label="键" />
                    <el-table-column prop="rejected_code" label="拒绝状态码" />
                    <el-table-column prop="time_window" label="时间窗口" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button link type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                            <el-button link type="primary" size="small" @click="handlePatch(scope)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="参数配置" @close="handleClose">
            <global_rules_Body :total="total" :patch="patch"></global_rules_Body>
        </el-dialog>
    </div>
</template>

<style scoped></style>