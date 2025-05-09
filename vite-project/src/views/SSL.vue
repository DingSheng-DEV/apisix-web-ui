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


// let k = {
//     "cert": "-----BEGIN CERTIFICATE-----\n<你的证书内容>\n-----END CERTIFICATE-----",
//     "key": "-----BEGIN RSA PRIVATE KEY-----\n<你的私钥内容>\n-----END RSA PRIVATE KEY-----",
//     "snis": ["example.com", "*.example.com"]
// };
// createSsls(k, 2).then((res) => {
//     console.log(res);
// });
// for (let i = 1; i < 60; i++) {
//     let k = {
//         certs: ["cert", "asd"],
//         keys: ["key", "ked"],
//         snis: ["t.com"],
//     };
//     createSsls(k, i).then((res) => {
//         console.log(res);
//     });
// }

const searchId = ref("");
const search = (id) => {
    tableList.value = [];
    getSslsById(id)
        .then((res) => {
            console.log(res.data);
            const { uri, id, methods, hosts, remote_addrs } = res.data.value;
            tableList.value.push({ uri, id, methods, hosts, remote_addrs });
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
const patch = ref("");

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
            const { uri, id, methods, hosts, remote_addrs } = item.value;
            tableList.value.push({ uri, id, methods, hosts, remote_addrs });
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
const txt = () => {
    const k = {
        "cert": ` $(cat t/ certs / apisix.crt)`,
    }
    getSsls().then((res) => {
        console.log(res);
    })
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
                    <el-button type="primary" @click="txt(index)">ettx</el-button>

                </div>
            </el-card>
            <el-card style="
          margin-top: 10px;
          max-height: calc(-240px + 100vh);
          overflow: auto;
        ">
                <el-empty description="数据暂无" v-if="tableList.length === 0" />
                <el-table :data="tableList" style="width: 100%" v-if="tableList.length !== 0">
                    <el-table-column prop="uri" label="uri" />
                    <el-table-column prop="id" label="id" />
                    <el-table-column prop="hosts" label="hosts" />
                    <el-table-column prop="methods" label="methods" />
                    <el-table-column prop="remote_addrs" label="remote_addrs" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="handleDelete(scope)">Delete</el-button>
                            <el-button link type="primary" size="small" @click="handlePatch(scope)">Patch</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <el-dialog v-model="dialogVisible" title="Parms">
            <SSLBody></SSLBody>
        </el-dialog>
    </div>
</template>

<style scoped></style>
