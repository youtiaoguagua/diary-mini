<template>
	<view class="" style="height: 100%;">
		<view class="" style="font-size: 34rpx;text-align: center;">
			今日心情如何？
		</view>
		<swiper class="swiper" @change="change">
			<swiper-item v-for="(item,index) in list" :key="index">
				<view class="cu-grid">
					<view class="cu-grid-item" v-for="(value,key) in item" :key="key">
						<view class="mood-image" @tap="confirmChoiceVest(value)">
							<image :src="`/static/mood/${rootData[value].icon==undefined?'angel':rootData[value].icon}.png`" 
							mode="widthFix" style="height: 100rpx;width: 100rpx;"></image>
						</view>
						<view class="">
							{{rootData[value].name}}
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="indicator-dots">
			<view class="indicator-dots-item" v-for="(item,index) in list" :key="index" 
			:class="[current == index ? 'indicator-dots-active' : '']">
				
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	props: {
		moodShow: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			current: 0,
			list: ['integral', 'kefu-ermai', 'coupon', 'gift', 'scan', 'pause-circle', 'wifi', 'email', 'list'],
			rootData:{},
		};
	},
	created() {
		this.rootData = this.moodData;
		this.spliteMood();
	},
	methods: {
		confirmChoiceVest(index) {
		      this.$emit('selectMoonList', index);
		    },
		showToast(index) {
						this.$refs.uToast.show({
							title: `点击${index}`,
							type: 'success',
							url: '/pages/user/index'
						})
					},
		change(e) {
			this.current = e.detail.current;
		},
		spliteMood(){
			let result = [[]];
			let count = 0;
			let resultCount=-1;
			let a = "0";
			for (let key of Object.keys(this.moodData)) {
				if(count%16==0){
					resultCount++
					result[resultCount]=[];
				}
				result[resultCount].push(key) ;
				count++;
			}
			this.list = result;
		}
	},
	computed: {
		
	}
};
</script>

<style>
.cu-grid{
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
	
.cu-grid-item{
	height: 200rpx;
	/* background: #dfe6e9; */
	/* border: 1px solid #000000; */
	text-align: center;
}
	
.cu-grid-item>.mood-image{
	height: 75%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.swiper {
	height: 90%;
}

.indicator-dots {
	margin-top: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.indicator-dots-item {
	background-color: #dfe6e9;
	height: 6px;
	width: 6px;
	border-radius: 10px;
	margin: 0 3px;
}

.indicator-dots-active {
	background-color:#74b9ff;
}
</style>
