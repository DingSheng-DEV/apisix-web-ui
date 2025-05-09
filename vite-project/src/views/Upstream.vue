<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import result from '@/components/main/result.vue';
import { ref, reactive, provide, inject, watch, onMounted } from "vue";
import resBody from "@/components/resBody/resBody.vue";
import upstreamBody from "@/components/resBody/upstreamBody.vue";
import { getUpstreams, getUpstreamsById, createUpstreams, DeleteUpstreamsID } from "@/api/index.js";
import { Search } from '@element-plus/icons-vue'
let tableList = ref([])
let apiType = inject('apiType');
let empty = ref(false);
watch(apiType, (newValue) => {
});
let dialogVisible = ref(false)

let searchId = ref('')
let search = (id) => {
    tableList.value = [];
    getUpstreamsById(id).then((res) => {
        console.log(res.data);
        let { id, hash_on, scheme, type, pass_host } = res.data.value;
        tableList.value.push({ pass_host, id, hash_on, type, scheme })
        if (tableList.value.length !== 0) {
            empty.value = false
        }
    }).catch(() => {
        if (tableList.value.length === 0) {
            empty.value = true
        }
    })

}
let patch = ref("");
let total = ref(0);


let reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}

let loadList = () => {
    tableList.value = [];
    getUpstreams().then((res) => {
        total.value = res.data.list.length + 1;
        for (let item of res.data.list) {
            let { id, hash_on, scheme, type, pass_host } = item.value;
            tableList.value.push({ pass_host, id, hash_on, type, scheme })
        }
        if (tableList.value.length === 0) {
            empty.value = true
        }
    });
}

let handleDelete = (event) => {
    DeleteUpstreamsID(event.row.id).then((res) => {
        console.log(res);
    });
    reflashList(event.$index)
}

const handleClose = () => {
    loadList()
    dialogVisible.value = false
}

let handlePatch = (event) => {
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
                    <el-table-column prop="pass_host" label="pass_host" />
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
            <upstreamBody :total="total" :patch="patch"></upstreamBody>
        </el-dialog>
    </div>
</template>

<style scoped></style>