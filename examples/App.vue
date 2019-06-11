<template>
    <div id="app">
        Example for Vue-mount
        {{ _uid }}

        <ul class="test-btns">
            <li><button @click="mountNew">mountNew</button></li>
            <li><button @click="mountRoot">mountRoot</button></li>
            <li><button @click="mountApp">mountApp</button></li>
            <li><button @click="mountRef">mountRef</button></li>
            <li><button @click="mountCmpRef">mountCmpRef</button></li>
            <li><button @click="mountWithListeners">with event listeners</button></li>
        </ul>

        <!-- <div id="target"
             ref="target"></div>

        <alert ref="alert"></alert> -->
    </div>
</template>

<script>
import Mount, { mount } from "../src";
import Alert from "./alert/index";

export default {
    name: "app",
    components: {
        Alert,
    },
    data() {
        return {
            uid: this._uid,
            alert: "#target"
        };
    },
    methods: {
        mountNew() {
            mount(Alert, {
                props: {
                    testProps: 123
                },
                data: {
                    target: "root",
                    notices: [
                        {
                            content: "mountNew",
                            duration: 10
                        }
                    ]
                }
            });
        },
        mountRoot() {
            mount(Alert, {
                target: "root",
                props: {
                    testProps: 123
                },
                data: {
                    target: "root",
                    notices: [
                        {
                            content: "mountRoot",
                            duration: 10
                        }
                    ]
                }
            });
        },
        mountApp() {
            mount(Alert, {
                target: "#app",
                props: {
                    testProps: 123
                },
                data: {
                    target: "#app",
                    notices: [
                        {
                            content: "mountApp",
                            duration: 10
                        }
                    ]
                }
            });
        },
        mountRef() {
            mount(Alert, {
                target: this.$refs.target,
                props: {
                    testProps: 123
                },
                data: {
                    target: this.$refs.target,
                    notices: [
                        {
                            content: "mountRef",
                            duration: 10
                        }
                    ]
                }
            });
        },
        mountCmpRef() {
            mount(Alert, {
                target: this.$refs.alert,
                props: {
                    testProps: 123
                },
                data: {
                    target: this.$refs.target,
                    notices: [
                        {
                            content: "mountCmpRef",
                            duration: 10
                        }
                    ]
                }
            });
        },
        mountWithListeners() {
            mount(Alert, {
                target: 'root',
                on: {
                    'mount:mount'(vm, mnt) {
                        console.log('mount:mounted');
                        vm.add({
                            content: 'Actived by on option',
                            duration: 1
                        });
                    },
                    'mount:destroy'() {
                        console.log('mount:destroyed')
                    },
                    remove: {
                        once: true,
                        handler: (vm, mnt) => {
                            console.log('remove');
                        }
                    },
                    'remove-with-event'(...args) {
                        console.log(args);
                    }
                }
            })
        }
    },
    mounted() {

    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
