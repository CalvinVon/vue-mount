<template>
	<div id="app">
		Example for Vue-mount

		<alert></alert>
	</div>
</template>

<script>
import alert from './alert';

export default {
	name: "app",
	mounted() {
		alert.info({
			content: 'VueMount-VueMount-VueMount-VueMount',
			duration: 10
		});
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
