import Vue from 'vue';
import { isType, isEmptyObject, isVueInstance, findParentVm, getElement } from './utils';

function parseOptions(options) {
    const { props = {}, data = {}, target } = options || {};
    return {
        target: getElement(target),
        propsData: props,
        targetData: data,
    };
}

class Mount {
    component_constructor;
    component_instance;
    component_vm;
    options;

    constructor(component, options) {
        this.component_constructor = Vue.extend(component);
        this.options = parseOptions(options);
    }

    getInstance(opt) {
        const options = isEmptyObject(opt) ? this.options : Object.assign(this.options, parseOptions(opt));
        const instance = this.component_instance || new this.component_constructor(options);
        if (isType(options.targetData, 'Object')) {
            Object.assign(instance, options.targetData);
        }
        return this.component_instance = instance;
    }

    getDom() {
        return this.component_vm && this.component_vm.$el;
    }

    mount(opt) {
        const instance = this.component_vm = this.getInstance(opt);
        
        if (!this.options.target) {
            instance.$mount(this.options.target);
            document.body.appendChild(this.component_vm.$el);
        }
        else {
            let hostVm = isVueInstance(this.options.target);
            if (hostVm) {
                hostVm.$destroy();
            }
            // adding to components tree
            if (!instance._isMounted) {
                const parentVm = findParentVm(this.options.target);
                if (parentVm) {
                    parentVm.$children.push(instance);
                    instance.$parent = parentVm;
                    instance.$root = parentVm.$root;
                }
            }
            instance.$mount(this.options.target);
        }
        return instance;
    }
}

export default Mount;