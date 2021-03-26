import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        meta: {
            title: "首页",
        },
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        meta: {
            title: "关于",
        },
        component: () =>
            import(/* webpackChunkName: "about" */ "@/views/About.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});
router.beforeEach((to, from, next) => {
    console.log(to.meta);
    document.title = to.meta.title;
    next();
});

export default router;
