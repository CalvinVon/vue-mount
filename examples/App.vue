<template>
	<div id="app">
		Example for Vue-mount
		{{ _uid }}

		<button @click="mountRoot">mountRoot</button>
		<button @click="mountApp">mountApp</button>
		<button @click="mountRef">mountRef</button>

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
							content: "VueMount-VueMount-VueMount-VueMount",
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
							content: "VueMount-VueMount-VueMount-VueMount",
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
							content: "VueMount-VueMount-VueMount-VueMount",
							duration: 10
						}
					]
				}
			});
		}
	},
	mounted() {}
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
