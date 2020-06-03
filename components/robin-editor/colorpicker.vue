<template>
	<view class="">
		<swiper class="swiper" @change="change">
			<swiper-item v-for="(colorlist,key) in list" :key="key">
				<u-grid :col="5" hover-class="hover-class">
					<u-grid-item v-for="(item, index) in colorlist" :index="index" :key="index"  @click="click(item)">
						<view class="color-item" style=""
						:style="{'border':`${item=='#ffffff'?'1rpx solid #000000':'none'}`,'background':item}">
							
						</view>
						<text class="grid-text">{{item}}</text>
					</u-grid-item>
				</u-grid>
			</swiper-item>
		</swiper>
		<view class="indicator-dots">
			<view class="indicator-dots-item" :class="[current == 0 ? 'indicator-dots-active' : '']">
			</view>
			<view class="indicator-dots-item" :class="[current == 1 ? 'indicator-dots-active' : '']">
			</view>
			<view class="indicator-dots-item" :class="[current == 2 ? 'indicator-dots-active' : '']">
			</view>
		</view>
	</view>
</template>

<script>
	import {colorList} from "./colorlist.js"
	export default {
		data() {
			return {
				current: 0,
				list: ['integral', 'kefu-ermai', 'coupon', 'gift', 'scan', 'pause-circle', 'wifi', 'email', 'list']
			};
		},
		created() {
			this.spliteColorList();
		},
		methods: {
			click(e){
				this.$emit("colorChanged",e);
			},
			spliteColorList(){
				let list = [];
				let index = 0;
				let count = -1;
				for(let color of colorList){
					if(index%15==0){
						count++;
						list.push([]);
					}
					list[count].push(color);
					index++
				}
				this.list = list;
			},
			change(e) {
				this.current = e.detail.current;
			}
		}
	};
</script>

<style scoped lang="scss">
	/* 下方这些scss变量为uView内置变量，详见开发  组件-指南-内置样式 */

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
	
	.swiper {
		height: 480rpx;
	}
	
	.indicator-dots {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.indicator-dots-item {
		background-color: $u-tips-color;
		height: 6px;
		width: 6px;
		border-radius: 10px;
		margin: 0 3px;
	}
	
	.indicator-dots-active {
		background-color: $u-type-primary;
	}
	
	.color-item{
		height: 50rpx;
		width: 50rpx;
		border-radius: 50%;
	}
</style>