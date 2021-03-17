<template>
    <div class="home">
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <van-button type="primary" @click="push">主要按钮</van-button>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "@/utils/request";
import Vue from "vue";
import { Button } from "vant";
Vue.use(Button);
export default {
    name: "Home",
    components: {
        HelloWorld,
    },
    mounted() {
        axios({
            url: "/psychology/nine_type_test/home", // 假地址 自行替换
            method: "get",
            params: {
                user_id: "stff2ba0756301a47c435aefee3e",
            },
        }).then((res) => {
            console.log(res);
        });
    },
    methods: {
        push() {
            this.$router.push({ path: "/about?id=1" });
        },
    },
};
</script>
