import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

import Alert from "./alert/index";
import Mount from "../src";


Vue.config.debug = true;

Vue.prototype.$main = 123;

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: '/' },
        { path: '/a' },
        { path: '/vue' },
    ]
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
