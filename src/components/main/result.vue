<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton } from "element-plus";
import { ref, inject, watch, onMounted } from "vue";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
import { useI18nUtils } from '@/utils/i18n.js';
let tableList = ref([])
let apiType = inject('apiType');
let empty = ref(false);
const { t } = useI18nUtils();
watch(apiType, (newValue) => {

});

// for (let i = 1; i < 30; i++) {
//     let k = {
//         "uri": "/index.html",
//         "hosts": ["foo.com", "*.bar.com"],
//         "remote_addrs": ["127.0.0.0/8"],
//         "methods": ["PUT", "GET"],
//         "enable_websocket": true,
//         "upstream": {
//             "type": "roundrobin",
//             "nodes": {
//                 "127.0.0.1:1980": 1
//             }
//         }
//     }
//     createRouters(k, i).then((res) => {
//         console.log(res);
//     });
// }

let reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}

let loadList = () => {
    tableList.value = [];
    getRouters().then((res) => {
        console.log(res.data.list);
        for (let item of res.data.list) {
            let { uri, id, methods, hosts, remote_addrs } = item.value;
            tableList.value.push({ uri, id, methods, hosts, remote_addrs })
        }
        if (tableList.value.length === 0) {
            empty.value = true
        }
    });
}

let handleDelete = (event) => {
    DeleteRouterByID(event.row.id).then((res) => {
        console.log(res);
    });
    reflashList(event.$index)
}

let handlePatch = (event) => {

}

let D = () => {
    DeleteRouterByID(1).then((res) => {
        console.log(res);
    });
}

let c = () => {
    let k = {
        "uri": "/index.html",
        "hosts": ["foo.com", "*.bar.com"],
        "remote_addrs": ["127.0.0.0/8"],
        "methods": ["PUT", "GET"],
        "enable_websocket": true,
        "upstream": {
            "type": "roundrobin",
            "nodes": {
                "127.0.0.1:1980": 1
            }
        }
    }
    createRouters(k).then((res) => {
        console.log(res);
    });
}

onMounted(() => [
    loadList()
])

</script>

<template>
    <div>
        <el-empty :description="t('messages.noData')" v-if="empty" />
        <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
            <el-table-column prop="uri" :label="t('table.uri')" />
            <el-table-column prop="id" :label="t('table.id')" />
            <el-table-column prop="hosts" :label="t('table.hosts')" />
            <el-table-column prop="methods" :label="t('table.methods')" />
            <el-table-column prop="remote_addrs" :label="t('table.remoteAddrs')" />
            <el-table-column :label="t('table.actions')">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleDelete(scope)">{{ t('common.delete') }}</el-button>
                    <el-button link type="primary" size="small" @click="handlePatch(scope)">{{ t('common.edit') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped></style>