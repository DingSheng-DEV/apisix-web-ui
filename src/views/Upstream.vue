<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import { ref, reactive, provide, inject, watch, onMounted } from "vue";
import upstreamBody from "@/components/resBody/upstreamBody.vue";
import { getUpstreams, getUpstreamsById, createUpstreams, DeleteUpstreamsID } from "@/api/index.js";
import { Search } from '@element-plus/icons-vue'
const tableList = ref([])
const apiType = inject('apiType');
const empty = ref(false);
watch(apiType, (newValue) => {
});
const dialogVisible = ref(false)
const searchId = ref('')
const patch = ref("");
const total = ref(0);
const reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}
const loadList = () => {
    tableList.value = [];
    getUpstreams().then((res) => {
        total.value = res.data.list.length + 1;
        for (let item of res.data.list) {
            let { id, hash_on, scheme, type, pass_host, name } = item.value;
            if (name === undefined) { name = 'undef' }

            tableList.value.push({ pass_host, id, hash_on, type, scheme, name })
        }
        if (tableList.value.length === 0) {
            empty.value = true
        }
        // 根据 id 排序
        tableList.value.sort((a, b) => {
            if (Number(a.id) < Number(b.id)) return -1; // 如果 a.id 小于 b.id，返回 -1
            if (Number(a.id) > Number(b.id)) return 1;  // 如果 a.id 大于 b.id，返回 1
            return 0;                   // 如果 a.id 等于 b.id，返回 0
        });
    });
}

const search = (id) => {
    if (id === '') {
        loadList()
        return
    }
    tableList.value = [];
    getUpstreamsById(id).then((res) => {
        let { id, hash_on, scheme, type, pass_host, name } = res.data.value;
        if (name === undefined) { name = 'undef' }

        tableList.value.push({ pass_host, id, hash_on, type, scheme, name })
        if (tableList.value.length !== 0) {
            empty.value = false
        }
    }).catch(() => {
        if (tableList.value.length === 0) {
            empty.value = true
        }
    })

}

const handleDelete = (event) => {
    DeleteUpstreamsID(event.row.id).then((res) => {
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
            <el-card style="margin-top: 10px;max-height: calc(-240px + 100vh);overflow: auto;">
                <el-empty description="数据暂无" v-if="tableList.length === 0" />
                <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
                    <el-table-column prop="id" label="ID" />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="pass_host" label="主机传递" />
                    <el-table-column prop="scheme" label="协议" />
                    <el-table-column prop="hash_on" label="哈希类型" />
                    <el-table-column prop="type" label="负载均衡" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button link type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                            <el-button link type="primary" size="small" @click="handlePatch(scope)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="参数配置" :before-close="handleClose">
            <upstreamBody :total="total" :patch="patch"></upstreamBody>
        </el-dialog>
    </div>
</template>

<style scoped></style>