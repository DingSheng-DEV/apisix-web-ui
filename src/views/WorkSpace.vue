<script setup>
import { ElButton, ElCard, ElOption, ElSelect, ElInput, ElForm, ElFormItem, ElEmpty, ElDialog } from "element-plus";
import { ref, reactive, provide } from "vue";
import LeftSideBar from "@/components/leftside/leftSideBar.vue";
import TopBar from "@/components/TopBar/TopBar.vue";
// import RouteReflect from "../public/RouteReflect.js";
import result from "@/components/main/result.vue";
import { Search } from "@element-plus/icons-vue";
let apiType = ref('')
provide('apiType', apiType);
let type = ref(-1);
let dialogVisible = ref(false)
let formBody = reactive({

})
let formData = ref({

})


const onBeforeSubmit = (index) => {
    dialogVisible.value = true
}

const onSubmit = () => {
    dialogVisible.value = false
}
</script>

<template>
    <div>
        <TopBar style="margin-bottom: 10px;"></TopBar>
        <div style="display: flex; height: calc(100vh - 150px);">
            <LeftSideBar></LeftSideBar>
            <router-view style="flex: 1; min-width: 0;"></router-view>
        </div>
    </div>



</template>

<style scoped></style>
