import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './pages/home';
import AntdDemo from './pages/antd-demo';
import RouterAndStoreDemo from './pages/router-and-store-demo';

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/antd',
            component: AntdDemo,
        },
        {
            path: '/router-and-store',
            component: RouterAndStoreDemo,
        },
    ]
});

Vue.use(VueRouter);
export default router;