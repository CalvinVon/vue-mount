# vue-mount
A tool for dynamic mounting Vue components and maintaining the component tree.

[![version](https://img.shields.io/npm/v/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)
[![](https://img.shields.io/npm/dt/vue-mount.svg)](https://github.com/CalvinVon/vue-mount)
[![](https://img.shields.io/github/size/CalvinVon/vue-mount/dist/vue-mount.min.js.svg?label=minified%20size)](https://github.com/CalvinVon/vue-mount/blob/master/dist/vue-mount.min.js)
[![dependencies](https://img.shields.io/david/CalvinVon/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)

[中文文档](README_zh.md) | English

## Demos
- [preview](https://vue-mount-demo.stackblitz.io/)
- [via NPM](https://stackblitz.com/edit/vue-mount-demo?file=App.js)
- [via CDN](https://jsbin.com/hojadorago/1/edit?html,js,output)

# Table of contents
- [Getting Started](#Getting-Started)
    - [Install](#Install)
- [Usage](#Usage)
    - [Basic usage](#Basic-usage)
    - [Advanced usage](#Advanced-usage)
- [MountOption](#MountOption)
    - [target](#target)
    - [mode](#mode)
    - [root](#root)
    - [rootOptions](#rootOptions)
    - [props](#props)
    - [data](#data)
    - [on](#on)
    - [watch](#watch)
- [Methods](#Methods)
    - [getInstance(MountOptions)](#getInstanceMountOptions)
    - [mount(MountOptions)](#mountMountOptions)
    - [set(MountDataOptions)](#setMountDataOptions)
    - [destroy()](#destroy)
    - [getDom()](#getDom)
- [Methods added on components](#Methods-added-on-components)
    - [$getMount()](#getMount)
- [Known issues](#known-issues)
    - [Unable to access $router/$store](#Unable-to-access-routerstore)
- [CHANGELOG](#CHANGELOG)

---

# Getting Started
### Install
You can install the library via npm.
```bash
npm i vue-mount -S
```
or via yarn:
```bash
yarn add vue-mount
```

or via CDN
```html
<!-- import Vue. -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>

<!-- import vue-mount -->
<script src="https://cdn.jsdelivr.net/npm/vue-mount/dist/vue-mount.min.js"></script>
<script>
    var mount = window['VueMount'].mount;
    var Mount = window['VueMount'].default;
</script>
```

---

# Usage
### Basic usage
```js
import { mount } from "vue-mount";
// just import a single file component
import Alert from "./alert.vue";

// mount component and return instance
const alert = mount(Alert);
```

### Advanced usage
```js
// The exposed method `mount(cmp, opt)` is the syntactic sugar of `new Mount(cmp, opt).mount()`
import Mount from "vue-mount";
// alert.vue is a common `single file component`
import Alert from "./alert.vue";

const mountAlert = new Mount(Alert, {
    // mount target.
    // the special value indicates create a new root vue instance
    target: 'new',
    // props data passed to component
    props: {
        content: 'Mount alert component to a new Vue root instance'
    },
    // modify component data
    data: {
        someInnerData: 'modified'
    },
    // attach event listeners
    on: {
        'some-event'(eventData, vm, mnt) {
            // vm is a component instance
            // mnt is current Mount instance
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(newValue, oldValue, vm, mnt) {
                console.log('Content has changed: ' + newValue);
                // do unwatch
                // make sure the unwatch method exsit while `immediate` is true
                if (mnt.unwatchMapper.content) {
                    mnt.unwatchMapper.content();
                }
            }
        }
    }
});

// Get alert component instance
let alertVm = mountAlert.getInstance();
// Mount alert component
// Component would not be mounted more than once
alertVm = mountAlert.mount();

// Dynamicly set props data of the component.
mountAlert.set({
    props: { content: 'Props changed' }
});
// Destroy component and it's element
mountAlert.destroy();

// New component would be mounted
alertVm = mountAlert.mount();
```

---


# MountOption
## **`target`**
- **Type:** { string | **Element** | **Vue** | **VNode** }
- **Default:** `new`
- **Details:** You can pass `css selector`, `Element`, `Vue instance`, `VNode` or special value including `new` and `root`
    - **`new`:** default value. Vue component would be mounted with a new Vue root instance.
    - **`root`:** Vue component would be mounted to an existing Vue root instance. if the root instance or root element is not found under `MountOption.root` option, the component would be mounted with a new Vue root instance behaving just like option `new`.
    - When giving a `Vue instance`, the component would **replace/append** the Vue instance and added to the components tree(see [MountOption.mode](#mode)), former Vue instance would be destroyed when the component is mounted.
- **Examples:**
    ```js
    mount(Alert, { target: "root" };
    mount(Alert, { target: "#target" };
    mount(Alert, { target: document.querySelector('.list') };
    mount(Alert, { target: this.$refs.component };
    mount(Alert, { target: this.$refs.component.$slots.default[0] };
    ```

> **Special Note**: When configured as `new`, the mounted component cannot access the configuration passed in the root instance, resulting in the mounted component UNABLE to access configuration globally registered on the root component such as `this.$router` (because a new root instance was created, but there is [alternative](#Unable-to-access-routerstore)); In other cases, `vue-mount` will automatically query and join the component tree context.

## **`mode`**
- **Type:** { string }
- **Default:** `replace`
- **Options:** `replace`, `append`
- **Details:** Specific the mount mode. Corresponds to the behavior on its component tree.
- **Examples:**
    ```js
    // Alert component would be append to current component
    mount(Alert, { 
        target: this,
        mode: 'append'
    });
    ```

> **Attention**: When the value of option `target` is `new`, or `root`, option `mode` will be ignored and be reset to `append`.


## **`root`**
- **Type:** { string | **Element** | **Vue** | **VNode** }
- **Default:** `#app`
- **Details:** Specific a root element. (All values given will be parsed to be an HTML element)

## **`rootOptions`**
- **Type:** { VueOptions }
- **Default:** `{}`
- **Details:** Specific the Vue contructor options when creating new vue root instance
- **Examples:**
    ```js
    mount(Alert, {
        rootOptions: {
            data: {
                root: 'new root instance'
            },
            methods: { ... },
            ...
        }
    };
    ```

## **`props`**
- **Type:** { Object }
- **Details:** Specific component props data.

## **`data`**
- **Type:** { Object }
- **Details:** Modify component data after the component instance was created (mounted is not necessary).

## **`on`**
- **Type:** { [event: string]: Function | Object }
- **Details:** Attach event listener to the component instance.
    - **build-in** event:
        - `mount:mount`: Triggered when calling `mount` method or ready to mount component。
        - `mount:destroy`: Triggered when (underlying) calling `destroy` method.
    - **Object configure**:
        - `once` { Boolean }: Whether the listener will be removed once it triggers for the first time.
        - `handler` { Function }: The event callback function. Compared to event callback function of Vue ([vm.$on/$once](https://vuejs.org/v2/api/index.html#vm-on)), the last two additional arguments are current `Vue component` and current `Mount instance`.

        > The `this` argument of the callback function points to the current **Mount instance**, although you can use the **arrow function** to avoid this behavior.
- **Examples:**
    ```js
    mount(Alert, {
        on: {
            'mount:mount'(vm, mnt) {
                console.log('mount:mount');
                vm.doSomething();
            },
            'mount:destroy'() {
                console.log('mount:destroy')
            },
            remove: {
                once: true,
                handler: (vm, mnt) => {
                    console.log('remove');
                }
            },
            'remove-with-data'(...args) {
                console.log(args);
            }
        }
    })
    ```

## **`watch`**
- **Type:** { [key: string]: Function | Object }
- **Details:** An object where keys are expressions to watch and values are the corresponding callbacks. The value can also be a string of a method name, or an Object that contains additional options.
    - **Object configure**:
        - `immediate` { Boolean }: Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression.
        - `deep` { Boolean }: To also detect nested value changes inside Objects, you need to pass in `deep: true` in the options argument.
        - `handler` { Function }: The callback function when the value changes. Compared to the callback function of Vue ([vm.$watch](https://vuejs.org/v2/api/index.html#vm-watch)), there are always be 4 parameters like: `newValue, oldValue, vm, mnt`. The last two additional arguments are current `Vue component` and current `Mount instance`.

        > The `this` argument of the callback function points to the current **Mount instance**, although you can use the **arrow function** to avoid this behavior.
    - **Unwatch**: Each key you passed in the `watch` option will be added to the attribute `unwatchMapper` of Mount instance, you can call the method like `mnt.unwatchMapper.attr()` to unwatch it.
- **Examples:**
    ```js
    mount(Alert, {
        watch: {
            otherAttr(newV) {
                console.log(newV);
            }
            attr: {
                handler(newValue, oldValue, vm, mnt) {
                    console.log(args);
                    // do unwatch
                    // make sure the unwatch method exsit while `immediate` is true
                    if (mnt.unwatchMapper.content) {
                        mnt.unwatchMapper.content();
                    }
                },
                immediate: true,
            },
        }
    })
    ```
> Attention: Only **declare the data upfront** in the `data` option, the callback function can be called.


# Methods
## **`getInstance(MountOptions)`**
- **Arguments:** { MountOptions }
- **Returns:** { Vue }
- **Details:** Return a vue component instance, calling the method multiple times will returns the same instance
> **Attention**: When the value of option `target` is `root` while no root instance/element was found(which means need to create a new Vue instance), or `target` is `new`, they all lead to the result that instance would be mounted right now.

> In order to ensure behavioral consistency, it is recommended to use the [`#mount`](#mountMountOptions) method first.

## **`mount(MountOptions)`**
- **Arguments:** { MountOptions }
- **Returns:** { Vue }
- **Details:** Mount Vue component, update the component tree and return a Vue component instance.
> Calling the method after the component was destroyed will **re-mount** the component.

> Calling the method multiple times will **ONLY mount once**

## **`set(MountDataOptions)`**
- **Arguments:** { MountDataOptions }
- **Returns:** { Mount } Current instance of `Mount`.
- **Details:** Dynamicly set `props`, `data` and `listeners` of the component.

## **`destroy()`**
- **Returns:** { Vue }
- **Details:** Destroy the Vue component instance and remove the associated elements. Diff from Vue's [$destroy](https://cn.vuejs.org/v2/api/#vm-destroy) method.


## **`getDom()`**
- **Returns:** { Element | Node }
- **Details:** Returns the element associated with the component.

---

# Methods added on components
## **`$getMount()`**
- **Returns:** { VueMount }
- **Details:** returns the VueMount instance associated with the component instance.


---

# Known issues
## Unable to access `$router`/`$store`

- When VueMount mounts the component to **a new Vue root instance**, the component will not be able to obtain the `$router`/ `$store` and other attributes ([reason](#target)) configured in the original root component. Of course, there are the following ways to solve this problem.


    ```js
    mount(Component, {
        ...
        data: {
            $store: this.$store,
            // Why not $router? VueRouter uses the object.defineProperty method internally and only sets the getter property, so this value cannot be overridden
            router: this.$router,
            ...
        },
        ...
    });
    ```
    Then you can use `this.$store` / `this.router` inside the component to access.

- When the component has been mounted on the original root instance, but the value cannot be obtained in the component's `created` / `mounted` lifecycle hooks, you need to use VueMount [built-in event](#on) to solve the problem:

    ```js
    mount(Component, {
        ...
        on: {
            'mount:mount'(vm) {
                vm.$router;
                vm.$store;
            }
        },
        ...
    }
    ```

---
# [CHANGELOG](./CHANGELOG.md)