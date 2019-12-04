<template>
	<Modal class="add-dialog"
		   title="Add"
		   centered
		   :visible="true"
		   @ok="handleOk"
		   @cancel="handleCancel"
		   :confirmLoading="confirmLoading">

		This is an Ant Design Modal.
		<br>
		data passed in:
		<ul>
			<li>list: {{ list }}</li>
			<li>text: {{ text }}</li>
		</ul>
	</Modal>
</template>

<script>
import { Modal } from 'ant-design-vue';

export default {
	name: 'addModal',
	components: {
		Modal
	},
	props: ['list', 'text'],
	data() {
		return {
			confirmLoading: false,
		}
	},
	created() {
		this.list.push('added by modal.vue');
	},
	methods: {
		// 确认
		async handleOk() {
			this.confirmLoading = true;

			setTimeout(() => {
				this.$emit("chosed", 'OK');
				this.confirmLoading = false;
			}, 500);
		},


		// 关闭
		handleCancel() {
			this.$emit('chosed', "CANCEL");
		},


	}
}
</script>