# vue-mount
A tool for dynamic mounting Vue components.

[![version](https://img.shields.io/npm/v/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)
[![](https://img.shields.io/npm/dt/vue-mount.svg)](https://github.com/CalvinVon/vue-mount)
[![](https://img.shields.io/github/size/CalvinVon/vue-mount/dist/vue-mount.min.js.svg?label=minified%20size)](https://github.com/CalvinVon/vue-mount/blob/master/dist/vue-mount.min.js)
[![dependencies](https://img.shields.io/david/CalvinVon/vue-mount.svg)](https://www.npmjs.com/package/vue-mount)


# Table of contents
- [Getting Started](#Getting-Started)
    - [Install](#Install)
- [Usage](#Usage)
    - [Typical usage](#Typical-usage)
    - [Advanced usage](#Advanced-usage)


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
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.runtime.common.prod.js"></script>

<!-- import vue-mount -->
<script src="https://cdn.jsdelivr.net/npm/vue-mount/dist/vue-mount.min.js"></script>
<script>
    var mount = window[VueMount].mount;
    var Mount = window[VueMount].default;
</script>
```

# Usage
### Typical usage
```js
import { mount } from "vue-mount";
import Alert from "./alert.vue";

// mount component and return instance
const alert = mount(Alert);
```

### Advanced usage
```js
import Mount, { mount } from "vue-mount";

const mountAlert = new Mount(Alert, {
    props: {
        content: 'Mount alert component to a new Vue root instance'
    },
    data: {
        someInnerData: 'modified'
    }
});

// Get alert component instance
let alertVm = mountAlert.getInstance();
// Mount alert component
alertVm = mountAlert.mount();

// Component would not be mounted more than once
alertVm = mountAlert.mount();

// Destroy component and it's element
alertVm = mountAlert.destroy();

// New component would be mounted
alertVm = mountAlert.mount();
```