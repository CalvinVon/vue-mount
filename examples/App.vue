<template>
	<div id="app">
		Example for Vue-mount
		{{ _uid }}

		<button @click="mountNew">mountNew</button>
		<button @click="mountRoot">mountRoot</button>
		<button @click="mountApp">mountApp</button>
		<button @click="mountRef">mountRef</button>
		<button @click="mountCmpRef">mountCmpRef</button>

		<div id="target"
		     ref="target"></div>

		<!-- <alert ref="alert"></alert>

		<a-slot ref="slot">
			<alert></alert>

			<template #mount>
				<alert></alert>
			</template>
		</a-slot> -->
	</div>
</template>

<script>
import Mount, { mount } from "../src";
import Alert from "./alert/index";
import Slot from "./slot/slot";

export default {
	name: "app",
	components: {
		Alert,
		"a-slot": Slot
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

		mountSlot() {}
	},
	mounted() {
		// const slot = mount(Slot, {
		// 	target: this.$refs.slot.$slots.default[0],
		// 	props: {
		// 		testProps: 123
		// 	},
		// 	data: {
		// 		id: 1
		// 	}
		// });

		// const slot2 = mount(Slot, {
		// 	target: slot.$el.querySelector('.default-slot'),
		// 	props: {
		// 		testProps: 123
		// 	},
		// 	data: {
		// 		id: 2
		// 	}
		// });

		const mountAlert = new Mount(Alert, {
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

		mountAlert.getInstance();
		mountAlert.mount();
		mountAlert.mount();
		console.log(mountAlert)
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
