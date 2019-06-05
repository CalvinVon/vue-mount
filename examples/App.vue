<template>
	<div id="app">
		Example for Vue-mount
		{{ _uid }}

		<button @click="mount">mount</button>

		<div id="target"
		     ref="target"></div>

		<!-- <alert ref="alert"></alert> -->
	</div>
</template>

<script>
import Alert from "./alert/index";
import Mount, { mount } from "../src";

export default {
	name: "app",
	components: {
		Alert
	},
	data() {
		return {
			uid: this._uid,
			alert: "#target"
		};
	},
	methods: {
		mount() {
			const alert = this.alert = mount(Alert, {
				props: {
					testProps: 123
				},
				data: {
					notices: [
						{
							content: "VueMount-VueMount-VueMount-VueMount",
							duration: 10
						}
					]
				}
			});
		}
	},
	mounted() {
		// const alert = new Mount(Alert).mount({
		// 	target: '#aaa',
		// 	props: {
		// 		testProps: 123
		// 	},
		// 	data: {
		// 		notices: [
		// 			{
		// 				content: "VueMount-VueMount-VueMount-VueMount",
		// 				duration: 100
		// 			}
		// 		]
		// 	}
		// });
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
