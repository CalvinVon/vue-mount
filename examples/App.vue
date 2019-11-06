<template>
	<div id="app">
		<h1>Example for Vue-mount</h1>
		<p>You'd better open <code class="code">Elements Panel</code> and <code class="code">vue-devtools</code> to look up the tree view</p>

		<h3>Current context: App component</h3>
		<ul class="test-btns">
			<li><button @click="appendCurrent">appendCurrent</button> Mount component append current component</li>
			<li><button @click="mountNew">mountNew</button> Mount component with a new Vue instance</li>
			<li><button @click="mountRoot">mountRoot</button> Mount component to root Vue instance</li>
			<li><button @click="mountApp">mountApp</button> Mount component to App root element and replace it</li>
			<li><button @click="mountRef">mountRef</button> Mount component to specific reference and replace it</li>
			<li><button @click="appendRef">appendRef</button> Mount component append to specific reference</li>
			<li><button @click="mountCmpRef">mountCmpRef</button> Mount component to specific mounted component and replace it</li>
			<li><button @click="appendCmpRef">appendCmpRef</button> Mount component append to specific mounted component</li>
			<li><button @click="mountWithListeners">with event listeners</button> Mount component with attached event listeners</li>
			<li><button @click="mountWithWatchOption">with watch option</button> Mount component with watch option</li>
			<li v-if="vm"><button @click="changeData">change props and data</button> Change props and data of the last component</li>
		</ul>

		<div id="target"
			 ref="target"></div>

		<alert ref="alert"></alert>
	</div>
</template>

<style>
#app .code {
	font-size: 16px;
	background: #424242;
	padding: 2px 4px;
	border-radius: 2px;
	color: white;
}
.test-btns li {
	margin: 5px 0;
}
</style>


<script>
import Mount, { mount } from "../src";
import Alert from "./alert";

export default {
	name: "app",
	components: {
		Alert
	},
	data() {
		return {
			uid: this._uid,
			alert: "#target",
			vm: null
		};
	},
	methods: {
		appendCurrent() {
			this.vm = mount(Alert, {
				target: this,
				mode: 'append',
				props: {
					testProps: 123
				},
				data: {
					new: 1,
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
		mountNew() {
			this.vm = mount(Alert, {
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
			this.vm = mount(Alert, {
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
			this.vm = mount(Alert, {
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
			this.vm = mount(Alert, {
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
		appendRef() {
			this.vm = mount(Alert, {
				target: this.$refs.target,
				mode: "append",
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
			this.vm = mount(Alert, {
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
		appendCmpRef() {
			this.vm = mount(Alert, {
				target: this.$refs.alert,
				mode: "append",
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
			this.vm = mount(Alert, {
				target: "root",
				on: {
					"mount:mount"(vm, mnt) {
						console.log("mount:mounted");
						vm.add({
							content: "Actived by on option",
							duration: 1
						});
					},
					"mount:destroy"() {
						console.log("mount:destroyed");
					},
					remove: {
						once: true,
						handler: (vm, mnt) => {
							console.log("remove");
						}
					},
					"remove-with-event"(...args) {
						console.log(args);
					}
				}
			});
		},

		mountWithWatchOption() {
			this.vm = mount(Alert, {
				target: "root",
				data: {
					attr: 'watch this data'
				},
				watch: {
					attr: {
						handler(...args) {
							console.log(args);
						},
						immediate: true,
					}
				}
			});
			setTimeout(() => {
				this.vm.attr = 'changed';
			}, 1000);
		},
		changeData() {
			this.vm.$getMount().set({
				props: {
					testProps: '`testProps` has changed at ' + Date.now()
				},
				data: {
					uid: '`uid` has changed'
				}
			});
		}
	},
	mounted() { }
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
