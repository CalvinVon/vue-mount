<template>
	<div class="antd-demo">
		<AButton @click="openModal">Open Modal</AButton>
	</div>
</template>

<script>
import { Button as AButton } from 'ant-design-vue';
import "ant-design-vue/dist/antd.css";
import Mount from '../../../src';
import Modal from './modal';

let dialogMounter;
export default {
	name: "antd-demo",
	components: {
		AButton
	},
	props: {

	},
	data() {
		return {
			list: [],
		};
	},
	mounted() {
		dialogMounter = new Mount(Modal, {
			target: this,
			mode: 'append',
			props: {
				list: this.list
			},
			on: {
				chosed: {
					handler: (value, vm, mnt) => {
						mnt.destroy();

						console.log(value);
					}
				},
			},
			watch: {
				list: {
					immedate: true,
					handler(newValue, oldValue, mnt, vm) {
						console.log(newValue, oldValue, mnt, vm)
					}
				},
				confirmLoading(...args) {
					console.log(args)
				}
			}
		})
	},
	methods: {
		openModal() {
			dialogMounter.mount({
				props: {
					text: 'mount options'
				}
			});

			dialogMounter.unwatchMapper.confirmLoading();

			dialogMounter.set({
				watch: {
					confirmLoading(...args) {
						console.log('You can bind same event multiple times ' + args);
					}
				}
			})
		}
	},
};
</script>

<style>
.antd-demo {
}
</style>
