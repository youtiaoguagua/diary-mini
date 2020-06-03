<template>
	<view class="">
		<view class="">
			<button type="default" @tap="teste">dsadsad</button>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default{
		data() {
			return {
			}
		},
		methods:{
			teste(){
				this.$emit("test","hao")
			}
		}
	}
</script>

<style>
</style>
