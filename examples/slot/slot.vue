<template>
	<div class="slot-component">
		<slot>
			<div class="default-slot">This is default slot</div>
		</slot>

		<slot name="mount">This is named slot</slot>
	</div>
</template>

<script>
export default {
	name: "slot-component",
	props: {},
	data() {
		return {
            id: ''
        };
	},
	created() {},
	mounted() {},
	methods: {}
};
</script>

<style>
.slot {
}
</style>
