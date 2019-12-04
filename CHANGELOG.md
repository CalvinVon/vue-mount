## 0.6.2 (2019-12-04)

### Bug Fixes

* fix the bug that *passing options multiple times will overwrite the previous. ([fe23366](https://github.com/CalvinVon/vue-mount/commit/fe23366))


## 0.6.1 (2019-11-25)

### Bug Fixes

* fix bug calling `set` method when the component has no `props` passed in ([e3e1cf1](https://github.com/CalvinVon/vue-mount/commit/e3e1cf1))


# 0.6.0 (2019-11-12)

### Features

* add new MountOption: watch ([b698214](https://github.com/CalvinVon/vue-mount/commit/b698214))
* **watch:** adjust the callback function to ensure that there are always four parameters ([e4d94ee](https://github.com/CalvinVon/vue-mount/commit/e4d94ee))



## 0.5.5 (2019-11-05)

### Bug Fixes

* **buildin-event:** fix emit 'mount:mount' event before listener binded ([6e0dfde](https://github.com/CalvinVon/vue-mount/commit/6e0dfde))
* The mount instance can calls the mount method again after the component is destroyed to mount the component again ([9f461c7](https://github.com/CalvinVon/vue-mount/commit/9f461c7))


