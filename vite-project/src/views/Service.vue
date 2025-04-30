<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import result from '@/components/main/result.vue';
import { ref, reactive, provide, inject, watch, onMounted } from "vue";
import resBody from "@/components/resBody/resBody.vue";
import ServiceBody from "@/components/resBody/serviceBody.vue";
import { getServices, DeleteServicesID, getServicesId, createServices } from "@/api/index.js";
import { Search } from '@element-plus/icons-vue'
let tableList = ref([])
let apiType = inject('apiType');
let empty = ref(false);
watch(apiType, (newValue) => {
});
let dialogVisible = ref(false)


// for (let i = 0; i < 60; i++) {
//     let c = {
//         "plugins": {
//             "limit-count": {
//                 "count": 2,
//                 "time_window": 60,
//                 "rejected_code": 503,
//                 "key": "remote_addr"
//             }
//         },
//         "enable_websocket": true,
//         "upstream": {
//             "type": "roundrobin",
//             "nodes": {
//                 "127.0.0.1:1980": 1
//             }
//         }
//     }

//     createServices(c, i).then((res) => {
//         console.log(res);
//     });
// }

let searchId = ref('')
let search = (id) => {
    tableList.value = [];
    getServicesId(id).then((res) => {
        console.log(res.data);
        let { enable_websocket, id, upstream } = res.data.value;
        let { hash_on, type, scheme } = upstream
        tableList.value.push({ enable_websocket, id, hash_on, type, scheme })
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

let reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}

let loadList = () => {
    tableList.value = [];
    getServices().then((res) => {
        console.log(res.data.list);

        for (let item of res.data.list) {
            let { enable_websocket, id, upstream } = item.value;
            let { hash_on, type, scheme } = upstream
            tableList.value.push({ enable_websocket, id, hash_on, type, scheme })
        }
        if (tableList.value.length === 0) {
            empty.value = true
        }
    });
}

let handleDelete = (event) => {
    DeleteServicesID(event.row.id).then((res) => {
        console.log(res);
    });
    reflashList(event.$index)
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
                <el-empty description="数据暂无" v-if="empty" />
                <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
                    <el-table-column prop="id" label="id" />
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
            <ServiceBody></ServiceBody>
            <!-- <div v-for="(value, key) in formData"
                style="display: flex;gap: 6px;margin: 5px 0px;align-items: center;">
                <span style="width: 12%;text-align: center;">{{ key }}</span>
                <el-input style="width: 75%;" :value="value">{{ key }}</el-input>
    </div>
    <div>
        <span>body:</span>
    </div>
    <div v-for="(value, key) in formBody"
        style="display: flex;gap: 6px;margin: 5px 0px;align-items: center;justify-content: space-between;padding: 0 20px;">
        <span style="text-align: center;">{{ key }}:{{ value }}</span>
        <el-input style="width: 25%;"></el-input>
    </div> -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit">
                        发送
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>