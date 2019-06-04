<template>
	<div id="app">
		Example for Vue-mount

		<div id="target" ref="target"></div>

		<alert ref="alert"></alert>
	</div>
</template>

<script>
import Alert from './alert/index';
import Mount from '../src';

export default {
	name: "app",
	components: {
		Alert
	},
	mounted() {
		const alert = new Mount(Alert).mount({
			target: this.$refs.alert,
			props: {
				testProps: 123
			},
			data: {
				testData: 321
			}
		});
        alert.add({
			content: 'VueMount-VueMount-VueMount-VueMount',
			duration: 10
		});
		
		alert.$emit('event', 123);
		
		// const alert2 = new Mount(Alert).mount();
        // alert2.add({
		// 	content: 'VueMount-22222',
		// 	duration: 10
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
