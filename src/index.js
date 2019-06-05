import Vue from 'vue';
import { isOneOf, isType, isEmptyObject, isVueInstance, findParentVm, getElement } from './utils';

function parseOptions(options) {
    const {
        props = {},
        data = {},
        target = 'new',
        root = '#app'
    } = options || {};

    const rootEl = getElement(root);
    let rootVm = isVueInstance(rootEl);
    rootVm = rootVm && rootVm.$root;
    return {
        rootEl,
        rootVm,
        target,
        targetElement: getElement(target),
        propsData: props,
        targetData: data,
    };
}

class Mount {
    options;
    component_options;
    component_constructor;
    component_instance;
    component_vm;

    _to_append_component = false;
    _to_append_root = false;
    _to_create_root = false;
    _created_root_vue;

    constructor(component, options) {
        this.component_options = component;
        this.options = parseOptions(options);
        this.component_constructor = Vue.extend(component);
    }


    /**
     * Generate instance (only once)
     * @description Only generate vue component instannce (or vue instance), and would do nothing with components tree
     * @param {MountOptions} opt mount options
     */
    getInstance(opt = {}) {
        const options = isEmptyObject(opt) ? this.options : Object.assign(this.options, parseOptions(opt));

        if (this.component_instance) {
            return this.component_instance;
        }

        // Has specific target element
        if (options.targetElement) {
            this._to_append_component = true;

            const instance = this.component_instance = new this.component_constructor(options);
            if (isType(options.targetData, 'Object')) {
                Object.assign(instance, options.targetData);
            }
        }

        // Would mount append to root
        else if (isOneOf(options.target, 'root', 'new')) {
            this._to_append_root = true;

            if (options.rootVm && options.target !== 'new') {
                const instance = this.component_instance = new this.component_constructor(options);
                if (isType(options.targetData, 'Object')) {
                    Object.assign(instance, options.targetData);
                }
            }
            else {
                this._to_create_root = true;

                const rootVue = new Vue({
                    data: options.propsData,
                    render: h => {
                        const component = this.component_options;
                        return h(component, {
                            props: options.propsData
                        });
                    }
                });
                if (options.rootEl) {
                    if (options.rootVm) {
                        rootVue.$mount();
                        if (options.target === 'new') {
                            document.body.appendChild(rootVue.$el);
                        }
                        else {
                            options.rootEl.appendChild(rootVue.$el);
                        }
                    }
                    else {
                        rootVue.$mount(options.rootEl);
                    }
                }
                else {
                    rootVue.$mount();
                    document.body.appendChild(rootVue.$el);
                }

                this._created_root_vue = rootVue;
                this.component_instance = rootVue.$children[0];
            }
        }
        else {
            throw new Error(`[vue-mount] Can't mount to target with value [${options.target}]`);
        }

        // this.component_instance.__mount__ = this;
        return this.component_instance;
    }


    /**
     * Mount component
     * @description Combine vue component instance with components tree
     * @param {Object} opt MountOptions
     */
    mount(opt) {
        const instance = this.component_vm = this.getInstance(opt);
        const options = this.options;

        // Instance would not mount more than once
        if (instance._isMounted) return instance;

        // Append to root vue instance
        if (this._to_append_root) {
            if (!this._to_create_root) {
                instance.$root = options.rootVm;
                instance.$parent = options.rootVm;
                options.rootVm.$children = [...new Set([...options.rootVm.$children, instance])];
                instance.$mount();
                options.rootEl.appendChild(instance.$el);
            }
            else {
                // NOTE: instance has been mounted in method `getInstance`
            }
        }

        // Append to vue component instance
        else {
            let hostVm = isVueInstance(this.options.targetElement);
            if (hostVm) {
                const _parent = hostVm.$parent;
                hostVm.$destroy();
                instance.$parent = _parent;
                _parent.$children = [...new Set([..._parent.$children, instance])];
            }

            const parentVm = findParentVm(this.options.targetElement);
            if (parentVm) {
                parentVm.$children = [...new Set([...parentVm.$children, instance])];
                instance.$parent = parentVm;
                instance.$root = parentVm.$root;
            }
            instance.$mount(this.options.targetElement);
        }
        instance.$el.__mount__ = this;
        return instance;
    }

    getDom() {
        return this.component_vm && this.component_vm.$el;
    }
}

export default Mount;
export function mount(component, opt) {
    return new Mount(component, opt).mount();
}