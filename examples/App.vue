<template>
	<div id="app">
		<h1>Example for Vue-mount</h1>
		<p>You'd better open <code class="code">Elements Panel</code> and <code class="code">vue-devtools</code> to look up the tree view and click <code class="code">refresh</code> button maybe</p>

		<router-view></router-view>
	</div>
</template>


<script>

export default {
	name: "app",
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
