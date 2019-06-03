import Vue from 'vue';

class Mount {
    component_constructor;
    component_instance;
    constructor(component, options) {
        this.component_constructor = Vue.extend(component);

    }

    getInstance() {
        const instance = this.component_instance || new this.component_constructor();
        return this.component_instance = instance;
    }

    mount() {
        const instance = this.getInstance();
        instance.mount();
    }
}