# vue-mount
vue-mount —— 一个动态加载 Vue 组件并维护组件树的工具库。

[![version](https://img.shields.io/npm/v/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)
[![](https://img.shields.io/npm/dt/vue-mount.svg)](https://github.com/CalvinVon/vue-mount)
[![](https://img.shields.io/github/size/CalvinVon/vue-mount/dist/vue-mount.min.js.svg?label=minified%20size)](https://github.com/CalvinVon/vue-mount/blob/master/dist/vue-mount.min.js)
[![dependencies](https://img.shields.io/david/CalvinVon/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)

中文文档 | [English](README.md)

## Demos
- [效果预览](https://vue-mount-demo.stackblitz.io/)
- [工程化用法](https://stackblitz.com/edit/vue-mount-demo?file=App.js)
- [CDN用法](https://jsbin.com/hojadorago/1/edit?html,js,output)

# Table of contents
- [开始](#开始)
    - [安装](#安装)
- [用法](#用法)
    - [基本用法](#基本用法)
    - [高级用法](#高级用法)
- [MountOption 配置项](#MountOption-配置项)
    - [target](#target)
    - [mode](#mode)
    - [root](#root)
    - [rootOptions](#rootOptions)
    - [props](#props)
    - [data](#data)
    - [on](#on)
- [实例方法](#实例方法)
    - [getInstance(MountOptions)](#getInstanceMountOptions)
    - [mount(MountOptions)](#mountMountOptions)
    - [set(MountDataOptions)](#setMountDataOptions)
    - [destroy()](#destroy)
    - [getDom()](#getDom)
- [在组件上添加的方法](#在组件上添加的方法)
    - [$getMount()](#getMount)
- [已知的问题](#已知的问题)
    - [无法访问到 `$router`/`$store`](#无法访问到`$router`/`$store`)
- [CHANGELOG](#CHANGELOG)

# 开始
### 安装
你可以通过 `npm` 来安装。
```bash
npm i vue-mount -S
```
或者通过 `yarn` 安装：
```bash
yarn add vue-mount
```

还可以直接使用 `CDN` 方式引入
> 先决条件：该方式必须先要引入完整 `Vue`，或者在 `window` 对象上暴露出 `Vue` 构造函数。
```html
<!-- 首先要引入 Vue -->
<!-- 可以在 `window.Vue` 中拿到 `Vue` 构造函数 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>

<!-- 引入 vue-mount -->
<script src="https://cdn.jsdelivr.net/npm/vue-mount/dist/vue-mount.min.js"></script>
<script>
    var mount = window['VueMount'].mount;
    var Mount = window['VueMount'].default;
</script>
```


# 用法
### 基本用法
```js
// 引入 mount 方法
import { mount } from "vue-mount";
// 引入 Alert 组件
import Alert from "./alert.vue";

// 动态挂载 Alert 组件实例并返回
const alert = mount(Alert);
```

### 高级用法
```js
// 暴露出的方法 `mount(cmp, opt)` 相当于 `new Mount(cmp, opt).mount()`的一个快捷语法糖
import Mount from "vue-mount";
import Alert from "./alert.vue";

const mountAlert = new Mount(Alert, {
    // 挂载目标
    // 特殊值 `new` 表明去创建并挂载到一个新的 Vue 根实例上
    target: 'new',
    // 需要传入组件 props 参数的数据对象
    props: {
        content: 'Mount alert component to a new Vue root instance'
    },
    // 可以修改组件内部的 响应式数据
    data: {
        someInnerData: 'modified'
    },
    // 添加事件监听器
    on: {
        'some-event'(eventData, vm, mnt) {
            // 每个处理函数都会追加传入两个辅助参数
            // eventData 是原来的事件监听器参数（根据组件发射的事件，参数可能不存在也可能存在多个）
            // vm 是当前挂载的组件实例
            // mnt（mount的缩写）是当前创建挂载组件的 vue-mount 实例
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(newValue, oldValue, vm, mnt) {
                console.log('Content has changed: ' + newValue);
                // 取消 watch
                // 当 `immediate` 为 true 时，需要确保取消函数存在
                if (mnt.unwatchMapper.content) {
                    mnt.unwatchMapper.content();
                }
            }
        }
    }
});

// 拿到 Alert 组件的实例
let alertVm = mountAlert.getInstance();
// 挂载实例
// 另外，在 Mount 实例上调用多次 mount 方法只会挂载组件一次
alertVm = mountAlert.mount();

// 挂载后动态设置组件的 props 属性值
mountAlert.set({
    props: { content: 'Props changed' }
});
// 完全销毁一个实例，并且移除组件对应的 DOM。
mountAlert.destroy();

// 销毁之后新的组件实例会被重新挂载
alertVm = mountAlert.mount();
```

---

# MountOption 配置项
## **`target`**
- **类型:** { string | **Element** | **Vue** | **VNode** }
- **默认值:** `new`
- **说明:** 你可以传入 `css selector`, `Element`, `Vue instance`, `VNode` 或者是包括 `new` 和 `root` 的特殊预设值。
    - **`new`:** 默认特殊预设值. Vue 组件实例会被挂载到一个**新创建的 Vue 根实例**上。
    - **`root`:** Vue 组件实例将被挂载到**现有的 Vue 根实例**上。 *如果在 `MountOption.root` 选项下找不到根实例或根元素，组件实例将被挂载到一个新的 Vue 根实例上，其行为将与选项 `new` 相似*。
    - 当传入一个 `Vue 实例对象` 时，新的组件实例将会**替换/追加到**传入的实例（具体参见 [`MountOption.mode`](#mode) 配置），并且在 Vue 组件树上更新。 当新的组件实例挂载时，传入的实例将会被销毁。
- **用例:**
    ```js
    mount(Alert, { target: "root" };
    mount(Alert, { target: "#target" };
    mount(Alert, { target: document.querySelector('.list') };
    mount(Alert, { target: this.$refs.component };
    mount(Alert, { target: this.$refs.component.$slots.default[0] };
    ```
    
> **特别注意**：当配置为 `new` 时，挂载的组件无法访问到创建根实例时传入的配置，导致在挂载的组件内无法访问 `this.$router` 等在根组件上全局注册的配置（原因是创建了一个新的根实例，但是存在[替代方案](#无法访问到-router-store)）；其他情况下，`vue-mount` 会自动查询并加入组件树上下文。


## **`mode`**
- **类型:** { string }
- **默认值:** `replace`
- **备选项:** `replace`, `append`
- **说明:** 指定挂载方式：`替换` 和 `追加` 模式。对应到其组件树上的行为。
- **用例:**
    ```js
    // Alert 组件实例将会被追加挂载到当前组件（this）上。
    mount(Alert, { 
        target: this,
        mode: 'append'
    });
    ```

> 值得注意的是：当配置项 `target` 值为 `new` 或者 `root` 时，`mode` 将被忽略并重置成 `append`。


## **`root`**
- **类型:** { string | **Element** | **Vue** }
- **默认值:** `#app`
- **说明:** 指定当前应用的根元素.(所有给出的值在内部都将被解析为HTML元素)。

## **`rootOptions`**
- **类型:** { VueOptions }
- **默认值:** `{}`
- **说明:** 允许指定在创建新的 Vue 根实例时的构造选项。
- **用例:**
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
- **类型:** { Object }
- **说明:** 指定传入组件的 props 值。

## **`data`**
- **类型:** { Object }
- **说明:** 指定的值将会在实例创建完毕（也可能未挂载）时修改组件内部响应式数据。

## **`on`**
- **类型:** { [event: string]: Function | Object }
- **说明:** 将事件侦听器附加到组件实例。
    - **内置** 事件:
        - `mount:mount`: 在调用 `mount` 方法或准备挂载组件时触发。
        - `mount:destroy`: 触发​​何时（底层）调用 `destroy` 方法
    - 当传入**配置对象**:
        - `once` { Boolean }: 是否在第一次触发时删除侦听器（只触发一次）。
        - `handler` { Function }: 事件触发回调函数.与 Vue 的事件回调函数 ([vm.$on/$once](https://vuejs.org/v2/api/index.html#vm-on))相比，会在参数列表后追加两个辅助参数，`当前组件实例` 和 `当前 Mount 实例`。

        > 回调函数的 `this` 指向为**当前的 Mount 实例**，当然你可以使用**箭头函数**来避免这一行为。
- **用例:**
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
- **类型:** { [key: string]: Function | Object }
- **说明:** 一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。
    - 当传入**配置对象**:
        - `immediate` { Boolean }: Passing in `immediate: true` in the option will trigger the callback immediately with the current value of the expression.
        - `deep` { Boolean }: 为了发现对象内部值的变化，可以在选项参数中指定 deep: true 。注意监听数组的变动不需要这么做。
        - `handler` { Function }: 值更改时的回调函数。与 Vue 的回调函数（[vm.$watch](https://vuejs.org/v2/api/index.html#vm-watch)）相比，此回调函数通常有4个参数，如：newValue、oldValue、vm、mnt。最后两个辅助参数是：`当前组件实例` 和 `当前 Mount 实例`。

        > 回调函数的 `this` 指向为**当前的 Mount 实例**，当然你可以使用**箭头函数**来避免这一行为。
    - **Unwatch**: 传给 `watch` 选项每个键都将添加到 Mount 实例的属性 `unwatchMapper` 中，您可以调用类似 `mnt.unwatchMapper.attr()` 的方法来取消监听。
- **用例:**
    ```js
    mount(Alert, {
        watch: {
            otherAttr(newV) {
                console.log(newV);
            }
            attr: {
                handler(newValue, oldValue, vm, mnt) {
                    console.log(args);
                    // 取消 watch
                    // 当 `immediate` 为 true 时，需要确保取消函数存在
                    if (mnt.unwatchMapper.content) {
                        mnt.unwatchMapper.content();
                    }
                },
                immediate: true,
            },
        }
    })
    ```
> 注意：只有在 `data` 选项中**提前声明数据**，值变化时监听回调函数才能被正常调用。



---


# 实例方法
## **`getInstance(MountOptions)`**
- **参数:** { MountOptions }
- **返回:** { Vue }
- **说明:** 返回一个 vue 组件实例。多次调用该方法只会创建实例一次，且将返回相同的实例。
> 注意：当选项 `target` 的值是 `root`, 且没有找到根实例/元素时（这种情况将导致*创建一个新的 Vue 根实例*）或者当值为 `new` 时，两种情况都将导致组件实例会被立即挂载。

> 值得注意：为了确保行为一致性，推荐优先使用 [`#mount`](#mountMountOptions) 方法。

## **`mount(MountOptions)`**
- **参数:** { MountOptions }
- **返回:** { Vue }
- **说明:** 挂载 Vue 组件、更新组件树并返回 Vue 组件实例。
> 若在组件已被 `destroy` 之后再次调用该方法将重新装载该组件（你可以认为 mount 实例为组件工厂）。

> 多次调用该方法只会挂载实例一次，且将返回相同的实例。


## **`set(MountDataOptions)`**
- **参数:** { MountDataOptions }
- **返回:** { Mount } 当前 `Mount` 实例。
- **说明:** 动态设置组件实例的 `props`、 `data` 和 `listeners`。

## **`destroy()`**
- **返回:** { Vue }
- **说明:** 销毁 Vue 组件实例并删除关联的元素，并更新组件树。与 Vue 的 [$destroy](https://cn.vuejs.org/v2/api/#vm-destroy) 方法不同，销毁整个组件与其 DOM。

## **`getDom()`**
- **返回:** { Element | Node }
- **说明:** 返回组件实例相关联的 DOM。


---

# 在组件上添加的方法
## **`$getMount()`**
- **返回:** { VueMount }
- **说明:** 返回组件实例相关联的 VueMount 实例。

---

# 已知的问题
## 无法访问到 `$router`/`$store`

- 当 VueMount 将组件挂载到**新的 Vue 根实例**上时，该组件将无法获取到在原根组件配置的 `$router`/`$store` 等属性（[原因](#target)），当然也有以下方式来解决该问题。

    ```js
    mount(Component, {
        ...
        data: {
            $store: this.$store,
            // 为什么不是 $router? VueRouter 在内部使用了 Object.defineProperty 方法并只设置了 getter 属性，故在该组件无法覆盖这个值
            router: this.$router,
            ...
        },
        ...
    });
    ```
    然后就便可在组件内部使用 `this.$store`/`this.router` 得到该值。

- 当组件已经挂载在原根实例上，但在组件的 `created`/`mounted` 等生命周期内获取不到该值时，需要使用 VueMount [内置的事件](#on) 来解决：
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
    原因是 VueMount 在内部统一在组件之后才计算父组件。
---
# [CHANGELOG](./CHANGELOG.md)