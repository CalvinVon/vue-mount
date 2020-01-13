import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        some: 'thing'
    },
    mutations: {
        change({ state }, newData) {
            state.some = newData;
        }
    }
});

export default store;