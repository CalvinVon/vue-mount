import Vue from 'vue';
import {
    isOneOf,
    isType,
    isEmptyObject,
    isVueInstance,
    isRootVue,
    findParentVm,
    getElement,
    checkAndRmUnmountedVm
} from './utils';

/**
 * Parse options
 * @param {MountOptions} options
 * @param {Object} options.props component props data
 * @param {Object} options.data component data
 * @param {string|Element|Vue|VNode} options.target component mount target.
 *      - when string: Options: `new`,`root`. Default: `new`.
 * @param {string} options.mode component mount mode.
 *      - Options: `replace`,`append`. Default: `replace`.
 *      - disabled when target is `new` or `root`.
 * @param {string|Element|Vue|VNode} options.root app root element
 * @param {VueOptions} options.rootOptions app root instance options
 */
function parseOptions(options) {
    const {
        props = {},
        data = {},
        on = {},
        target = 'new',
        mode = 'replace',
        root = '#app',
        rootOptions = {}
    } = options || {};

    const rootEl = getElement(root);
    let rootVm = isVueInstance(rootEl);
    rootVm = rootVm && rootVm.$root;
    return {
        rootEl,
        rootVm,
        target,
        targetElement: getElement(target),
        mode,
        propsData: props,
        targetData: data,
        targetEventListener: on,
        rootOptions
    };
}

class Mount {
    options;
    component_options;
    component_constructor;
    component_instance;

    _to_append_component = false;
    _to_append_root = false;
    _to_create_root = false;
    _is_destroyed = false;
    _created_root_vue;

    constructor(component, options) {
        this.component_options = component;
        this.options = parseOptions(options);
        this.component_constructor = Vue.extend(component);
    }


    /**
     * Generate a vue component instance
     * @description Only generate vue component instannce (or vue instance), and would do nothing with components tree
     * @param {MountOptions} opt mount options
     * @returns {Vue} Vue instance
     */
    getInstance(opt = {}) {
        const options = isEmptyObject(opt) ? this.options : Object.assign(this.options, parseOptions(opt));

        if (this._is_destroyed) return null;

        if (this.component_instance) {
            // Instance has been/is being destroyed
            if (this.component_instance._isDestroyed || this.component_instance._isBeingDestroyed) {
                this.destroy();
                return this.getInstance(opt);
            }
            else {
                return this.component_instance;
            }
        }

        // Has specific target element
        if (options.targetElement) {
            if (!isVueInstance(options.targetElement) && !findParentVm(options.targetElement)) {
                this._to_append_root = true;
                this._to_create_root = true;
            }
            else {
                this._to_append_component = true;
                this.component_instance = new this.component_constructor(options);
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
            }
        }
        else {
            throw new Error(`[vue-mount] Can't mount to target with value [${options.target}]`);
        }

        if (this._to_append_root) {
            if (this._to_create_root) {
                const rootOptions = {
                    data: options.propsData,
                    render: h => {
                        const component = this.component_options;
                        return h(component, {
                            props: options.propsData
                        });
                    }
                };

                if (isType(options.rootOptions, 'Object')) {
                    Object.assign(rootOptions, options.rootOptions);
                }
                const rootVue = new Vue(rootOptions);
                if (isOneOf(options.target, 'new', 'root') && options.rootEl) {
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

        // Modify component data
        if (isType(options.targetData, 'Object')) {
            Object.assign(this.component_instance, options.targetData);
        }

        // Attach component event listeners
        this._attachEventListeners(options.targetEventListener);

        if (this._to_append_root && this._to_create_root) {
            // Emit instance mount event
            this.component_instance.$emit('mount:mount');
        }

        if (this.component_instance) {
            this.component_instance.__mount__ = this;
            this.component_instance.$getMount = () => this;
        }


        return this.component_instance;
    }


    /**
     * Mount Vue component and return a Vue component instance
     * @description Combine vue component instance with components tree
     * @param {Object} opt MountOptions
     * 
     * @returns {Vue} Vue instance
     */
    mount(opt) {
        const instance = this.component_instance = this.getInstance(opt);
        const options = this.options;

        // Instance would not mount more than once
        if (!instance || instance._isMounted) return instance;

        // Append to root vue instance
        if (this._to_append_root) {
            if (!this._to_create_root) {
                checkAndRmUnmountedVm(options.rootVm);
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
            let hostVm = isVueInstance(options.targetElement),
                parentVm = findParentVm(options.targetElement);

            if (isRootVue(hostVm)) hostVm = hostVm.$children[0];

            if (hostVm) {
                // Whether replace host vm
                if (options.mode === 'append') {
                    parentVm = hostVm;
                }
                else {
                    const _parent = hostVm.$parent;
                    hostVm.$emit('mount:destroy');
                    hostVm.$destroy();
                    instance.$parent = _parent;
                    _parent && (_parent.$children = [...new Set([..._parent.$children, instance])]);
                }
            }

            if (parentVm) {
                parentVm.$children = [...new Set([...parentVm.$children, instance])];
                instance.$parent = parentVm;
                instance.$root = parentVm.$root;
            }

            if (options.mode === 'append') {
                // Append mount
                instance.$mount();
                options.targetElement.appendChild(instance.$el);
            }
            else {
                // Replace Mount
                instance.$mount(options.targetElement);
                checkAndRmUnmountedVm(parentVm);
            }
        }

        instance.$el.__mount__ = this;
        // Emit instance mount event
        instance.$emit('mount:mount');
        return instance;
    }


    /**
     * Set component `props`/`data` and `listeners`.
     * @param {MountOptions} opt
     * @returns {Mount}
     */
    set(opt) {
        const instance = this.component_instance = this.getInstance();
        const { props = {}, data = {}, on = {} } = opt || {};

        if (isType(data, 'Object')) {
            Object.assign(instance, data);
        }

        let _props = instance.$props;
        if (this._to_create_root) {
            _props = this._created_root_vue;
        }

        if (isType(props, 'Object')) {
            Object.assign(_props, props);
        }

        this._attachEventListeners(on);
        return this;
    }

    /**
     * Destroy the Vue component instance and remove the associated elements.
     * @returns {Vue}
     */
    destroy() {
        const instance = this.component_instance;
        instance.$emit('mount:destroy');
        instance.$destroy();
        instance.$el && instance.$el.parentNode.removeChild(instance.$el);
        this.component_instance = null;

        this._to_append_component = false;
        this._to_append_root = false;
        this._to_create_root = false;
        this._is_destroyed = false;
        this._created_root_vue = null;
        this._is_destroyed = true;
        return instance;
    }

    getDom() {
        return this.component_instance && this.component_instance.$el;
    }


    _attachEventListeners(listeners) {
        if (isType(listeners, 'Object')) {
            Object.keys(listeners).forEach(event => {
                const value = listeners[event];
                let eventListener,
                    attachMethod = this.component_instance.$on;

                // Parse event listener config
                if (isType(value, 'Function')) {
                    eventListener = value;

                }
                else if (isType(value, 'Object')) {
                    const { handler, once = false } = value;
                    if (once) {
                        attachMethod = this.component_instance.$once;
                    }
                    eventListener = handler;
                }

                const callback = (...args) => {
                    eventListener.apply(this, [...args, this.component_instance, this]);
                };

                // Attach listener
                attachMethod.call(this.component_instance, event, callback);
            });
        }
    }
}

export default Mount;
export function mount(component, opt) {
    return new Mount(component, opt).mount();
}