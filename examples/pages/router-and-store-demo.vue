<template>
	<div class="inhert-router-demo">
		<h3>inhert-router-demo</h3>
	</div>
</template>

<script>
import { mount } from '../../src';
const Cmp = {
	name: 'embedCmp',
	render(h) {
		return h(
			'div',
			{
				class: "embed-cmp",
			},
			[
				h('h4', ['I am embed-cmp'])
			]
		);
	},
	mounted() {
		console.log('In embedCmp: $router: ', this.$router);
		console.log('In embedCmp: $store: ', this.$store);
	}
};

export default {
	name: "inhert-router-demo",
	mounted() {
		mount(Cmp, {
			// target: this,
			// mode: 'append',
			data: {
				// $store: this.$store
			},
			on: {
				'mount:mount'(vm) {
					console.log('On `mount:mount` event, $router: ', vm.$router);
					console.log('On `mount:mount` event: $store: ', vm.$store);
				}
			}
		});
	}
};
</script>