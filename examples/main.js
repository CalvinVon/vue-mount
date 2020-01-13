import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.debug = true;
Vue.prototype.$a = 1;


new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app');