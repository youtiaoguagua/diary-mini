<template>
	<view class="xuanfu">
		<view class="">
			<view class="button"  @tap="buttonTap" >
				
			</view>
			<view class="shensuo" :class="[istap?'buttonhover':'buttondehover']">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				istap:false,
			}
		},
		methods: {
			buttonTap(){
				this.istap = this.istap?false:true;
			},
		}
	}
</script>

<style>
	.xuanfu{
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
	}
	
	.xuanfu>view{
		position: relative;
		height: 100rpx;
		min-width: 100rpx;
	}
	
	.button{
		position: absolute;
		width: 100rpx;
		height: 100rpx;
		background: #0066CC;
		right: 0;
	}
	
	.buttonhover{
		width: 300rpx;
		transition: 1s width;
	}
	
	.buttondehover{
		width: 100rpx;
		transition: 1s width;
	}
	
	.shensuo{
		/* position: absolute; */
		mini-width: 100rpx;
		height: 100rpx;
		background: #18B566;
	}
</style>
