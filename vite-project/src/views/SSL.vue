<script setup>
import {
    ElEmpty,
    ElTable,
    ElTableColumn,
    ElButton,
    ElCard,
    ElInput,
    ElDialog,
} from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { ref, reactive, inject, watch, onMounted } from "vue";
import SSLBody from "@/components/resBody/sslBody.vue";
import {
    getSsls,
    getSslsById,
    createSsls,
    PatchSsls,
    DeleteSsls,
} from "@/api/module/ssl.js";
const tableList = ref([]);
const apiType = inject("apiType");
const empty = ref(false);
watch(apiType, (newValue) => { });
const dialogVisible = ref(false);
const searchId = ref("");
const search = (id) => {
    tableList.value = [];
    if (id === '') {
        loadList()
        return
    }
    getSslsById(id)
        .then((res) => {
            console.log(res.data.value);
            const { cert, id, key, snis, type } = res.data.value;
            tableList.value.push({ cert, id, key, snis, type });
            if (tableList.value.length !== 0) {
                empty.value = false;
            }
        })
        .catch(() => {
            if (tableList.value.length === 0) {
                empty.value = true;
            }
        });
};
let patch = ref("");

const reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true;
    }
};

const loadList = () => {
    tableList.value = [];
    getSsls().then((res) => {

        for (const item of res.data.list) {
            const { cert, id, key, snis, type } = item.value;
            tableList.value.push({ cert, id, key, snis, type });
        }
        if (tableList.value.length === 0) {
            empty.value = true;
        }
    });
};

const handleDelete = (event) => {
    DeleteSsls(event.row.id).then((res) => {
        console.log(res);
    });
    reflashList(event.$index);
};

const handlePatch = (event) => {
    patch.value = event.row.id;
    dialogVisible.value = true;
};


const handleClose = () => {
    loadList()
    dialogVisible.value = false
}

onMounted(() => {
    loadList();
});

const onBeforeSubmit = (index) => {
    patch.value = "";
    dialogVisible.value = true;
};

const onSubmit = () => {
    dialogVisible.value = false;
};
</script>

<template>
    <div>
        <div style="display: flex; flex-direction: column; width: 100%">
            <el-card style="width: 100%; height: 80px">
                <div style="display: flex">
                    <el-input v-model="searchId" placeholder="根据id获取资源" class="input-with-select"
                        style="width: 25%; margin-right: 6px">
                        <template #prepend>
                            <el-button :icon="Search" @click="search(searchId)" />
                        </template>
                    </el-input>
                    <el-button type="primary" @click="onBeforeSubmit(index)">创建资源</el-button>
                </div>
            </el-card>
            <el-card style="
          margin-top: 10px;
          max-height: calc(-240px + 100vh);
          overflow: auto;
        ">
                <el-empty description="数据暂无" v-if="tableList.length === 0" />
                <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
                    <el-table-column prop="id" label="id" />
                    <el-table-column prop="cert" label="cert" width="150">
                        <template #default="scope">
                            <div class="truncated-text">{{ scope.row.cert }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="key" label="key" width="150">
                        <template #default="scope">
                            <div class="truncated-text">{{ scope.row.key }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="type" />
                    <el-table-column prop="snis" label="snis" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="handleDelete(scope)">Delete</el-button>
                            <el-button link type="primary" size="small" @click="handlePatch(scope)">Patch</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="Parms" @close="handleClose">
            <SSLBody :patch="patch"></SSLBody>
        </el-dialog>
    </div>
</template>

<style scoped>
.truncated-text {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
