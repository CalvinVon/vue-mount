import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './pages/home';
import AntdDemo from './pages/antd-demo';

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/antd',
            component: AntdDemo,
        }
    ]
});

Vue.use(VueRouter);
export default router;