import Vue from 'vue';
import { isEmptyObject } from './utils';

function parseOptions(options) {
    const { props = {}, data = {}, el } = options || {};
    return {
        el,
        propsData: props,
        data,
    };
}

class Mount {
    component_constructor;
    component_instance;
    component_vm;
    options;

    constructor(component, options) {
        this.component_constructor = Vue.extend(component);
        Vue.component(component.name, component);
        this.options = parseOptions(options);
    }

    getInstance(opt) {
        const options = isEmptyObject(opt) ? this.options : parseOptions(opt);
        const instance = this.component_instance || new this.component_constructor(options);
        return this.component_instance = instance;
    }

    getDom() {
        return this.component_vm && this.component_vm.$el;
    }

    mount(opt) {
        const instance = this.component_vm = this.getInstance(opt);
        instance.$mount();

        if (!this.options.el) {
            document.body.appendChild(this.component_vm.$el);
        }
        return instance;
    }
}

export default Mount;