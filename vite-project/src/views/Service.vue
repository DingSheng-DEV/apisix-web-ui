<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import result from '@/components/main/result.vue';
import { ref, reactive, provide, inject, watch, onMounted } from "vue";
import ServiceBody from "@/components/resBody/serviceBody.vue";
import { getServices, DeleteServicesID, getServicesId, createServices } from "@/api/index.js";
import { Search } from '@element-plus/icons-vue'
const tableList = ref([])
const apiType = inject('apiType');
const empty = ref(false);
watch(apiType, (newValue) => {
});
const dialogVisible = ref(false)

const searchId = ref('')
const search = (id) => {
    tableList.value = [];
    if (id === '') {
        loadList()
        return
    }
    getServicesId(id).then((res) => {
        let { enable_websocket, id, upstream, name } = res.data.value;
        if (name === undefined) { name = 'undef' }

        let { hash_on, type, scheme } = upstream
        tableList.value.push({ enable_websocket, id, hash_on, type, scheme, name })
        if (tableList.value.length !== 0) {
            empty.value = false
        }
    }).catch(() => {
        if (tableList.value.length === 0) {
            empty.value = true
        }
    })

}
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
    getServices().then((res) => {
        total.value = res.data.list.length + 1;
        for (const item of res.data.list) {
            let { enable_websocket, id, upstream, name } = item.value;
            if (name === undefined) { name = 'undef' }

            if (!upstream) {
                tableList.value.push({ enable_websocket, id, name })
            }
            if (upstream) {
                let { hash_on, type, scheme } = upstream
                // 如果 hash_on 是 undefined，设置为默认值
                if (hash_on === undefined) {
                    hash_on = 'defaultHash';
                }

                // 如果 hash_on 是 undefined，设置为默认值
                if (type === undefined) {
                    type = 'defaultHash';
                }

                // 如果 hash_on 是 undefined，设置为默认值
                if (scheme === undefined) {
                    scheme = 'defaultHash';
                }

                tableList.value.push({ enable_websocket, id, hash_on, type, scheme, name })
            }
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

const handleDelete = (event) => {
    DeleteServicesID(event.row.id).then((res) => {
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
                    <el-table-column prop="id" label="id" />
                    <el-table-column prop="name" label="name" />
                    <el-table-column prop="enable_websocket" label="enable_websocket" />
                    <el-table-column prop="scheme" label="scheme" />
                    <el-table-column prop="hash_on" label="hash_on" />
                    <el-table-column prop="type" label="type" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="handleDelete(scope)">Delete</el-button>
                            <el-button link type="primary" size="small" @click="handlePatch(scope)">Patch</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="Parms" :before-close="handleClose">
            <ServiceBody :patch="patch" :total="total"></ServiceBody>
        </el-dialog>
    </div>
</template>

<style scoped></style>