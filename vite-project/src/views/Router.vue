<script setup>
import { ElEmpty, ElTable, ElTableColumn, ElButton, ElCard, ElInput, ElDialog } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, inject, watch, onMounted } from "vue";
import resBody from "@/components/resBody/resBody.vue";
import routeBody from "@/components/resBody/routeBody.vue";
import { getRouterById } from "@/api/index.js";
import { getRouters, createRouters, DeleteRouterByID } from "@/api/index.js";
let tableList = ref([])
let apiType = inject('apiType');
let empty = ref(false);
watch(apiType, (newValue) => {
});

let type = ref(-1);
let dialogVisible = ref(false)
let formBody = reactive({

})
let formData = ref({

})

let searchId = ref('')
let search = (id) => {
    tableList.value = [];
    getRouterById(id).then((res) => {
        console.log(res.data);
        let { uri, id, methods, hosts, remote_addrs } = res.data.value;
        tableList.value.push({ uri, id, methods, hosts, remote_addrs })
        if (tableList.value.length !== 0) {
            empty.value = false
        }
    }).catch(() => {
        if (tableList.value.length === 0) {
            empty.value = true
        }
    })

}


let reflashList = (index) => {
    tableList.value.splice(index, 1);
    if (tableList.value.length === 0) {
        empty.value = true
    }
}

let loadList = () => {
    tableList.value = [];
    getRouters().then((res) => {
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


const onBeforeSubmit = (index) => {
    dialogVisible.value = true
    // formBody = []
    // formData = RouteReflect[index]
    // if (RouteReflect[index].body) {
    //   let { body, ...parms } = RouteReflect[index]
    //   formBody = JSON.parse(JSON.stringify(RouteReflect[index].body));
    //   formData = JSON.parse(JSON.stringify(parms));
    // }
    // dialogVisible.value = true
    // type.value = index
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
                <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item v-for="(item, index) in RouteReflect">
              <el-button type="primary" @click="onBeforeSubmit(index)"> {{ item.desc }}</el-button>
            </el-form-item>
          </el-form> -->
            </el-card>
            <el-card style="margin-top: 10px;overflow: auto;">
                <el-empty description="数据暂无" v-if="empty" />
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
            <!-- <resBody></resBody> -->

            <routeBody></routeBody>

        </el-dialog>
    </div>
</template>

<style scoped></style>