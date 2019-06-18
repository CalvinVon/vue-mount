import Vue from 'vue';
import App from './App.vue';
import { mount } from '../src';
import Alert from './alert';

Vue.config.debug = true;


new Vue({
    render: h => h(App),
}).$mount('#app');

mount(Alert, {
    props: {
        testProps: 222
    }
});