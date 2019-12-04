import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.debug = true;


new Vue({
    render: h => h(App),
    router
}).$mount('#app');