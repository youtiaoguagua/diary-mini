<template>
	<view class="body">
		<view class="my-book">
			<view class="my-rishi">
				<view class="title">
					我的日识
				</view>
				<view class="arrow-left" style="">
					<text class="icon-miniconsarrowrightround iconfont"></text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="hitokoto">
				竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。
			</view>
			<u-swiper :list="list"></u-swiper>
			<view class="books-templete">
				<view class="book" v-for="x in 4">
					<view class="top-picture" style="background-image: url(https://p.pstatp.com/origin/ff350001e0734c1823d0);">
						
					</view>
					<view class="bottom-title">
						日识小记
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						image: 'https://p.pstatp.com/origin/ffc200019992c91e97d1',
						title: '蒹葭苍苍，白露为霜。所谓伊人，在水一方'
					},
					{
						image: 'https://p.pstatp.com/origin/fe3f00015e7b1f90d6d8',
						title: '溯洄从之，道阻且长。溯游从之，宛在水中央'
					},
					{
						image: 'https://p.pstatp.com/origin/fe37000202e14b19d8f6',
						title: '蒹葭萋萋，白露未晞。所谓伊人，在水之湄'
					}
				],
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.body{
	
	}
	
	.my-book{
		height: 200rpx;
		position: relative;
		// background-color: #0066CC;
		
		.my-rishi{
			position: absolute;
			right: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 30rpx;
			text-shadow: 2rpx 2rpx 5rpx rgba(0,0,0,0.5);
			
			.title{
				font-size: 24rpx;
			}
			
			.arrow-left{
				text-align: center;
				
				text{
					font-size: 24rpx;
				}
			}
		}
	}
	
	.content{
		border-radius: 60rpx 60rpx 0 0;
		background-color: #FFFFFF;
		min-height: 500rpx;
		padding: 30rpx;
		// box-shadow:  0 10px 6px -6px #777;
		
		.hitokoto{
			text-align: center;
			font-size: 30rpx;
			font-weight: 800;
			padding-bottom: 20rpx;
		}
	}
	
	.books-templete{
		 display: grid;
		 grid-template-columns: repeat(2, 1fr);
		  grid-gap: 30rpx;
		  padding-top: 30rpx;
		  grid-auto-rows: minmax(340rpx, auto);
		 
		 .book{
			// width: 200rpx;
			// height: 200rpx;
			background-color: #FF9900;
			display: flex;
			flex-direction: column;
			border-radius: 8rpx;
			background-color: rgba(236, 240, 241,0.6);
			box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
			overflow: hidden;
			
			.top-picture{
				flex: 1;
				background-size: cover;
				background-repeat: no-repeat;
			}
			
			.bottom-title{
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
			}
		 }
	}
</style>

<style>
	page{
		background-color: #f8f8f8;
	}
	
@font-face {font-family: "iconfont";
  src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAK4AAsAAAAABoQAAAJtAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAp8gQoBNgIkAwgLBgAEIAWEbQdBG8EFyC4hJxt6REIk3SwoLQ36jq2FcPN+HAsiqJasnt0hhSCRIeoQFRYUCJUtCqTD+Bf2C6Hvai7351JgYXd8iRUA6cBech+4zGafXNHp6lcVqu5BtYpUZXXznhkgQb6ykwBaPvW/iiqa/497p3913gUy33nlMsekSV2AcUCB7YltsgIJvWHsApdwnkCnWeNKpztHV9AvWdMC8WRCF/pzASlZul1orVmb4keL9vJVBvAdfj/+w2z0U7RUVtXF43YAa3/bdpb6bO7c+4ggAW1uQcU2kMRNbeKMEoyidLI7FoGU4b/+G2wSe9UL9tdZpd1gGgruSeiKbpW1gKSUWWAPkfKRtbu79aXdvm61rjqdm273tvV51f667v7cdr6j25vSQ4BqqQlNm+vzvIY063gHOpA8ksDq+FWcTNuSPf1M0ASfU43t/rUPJfjn4YTmLqufaN+xM/hBwp5tqYstY0lVWJspZqkT13TqRAPYM+hjrGbkbmyhPSdkULSZgardMpqkbWjRZQdatTuATlt2N3cZwpTIDmx6BhD6vUDR6xeqfm9okt6hxahfaNUfCjrdxdCgLqthBk+YXHmkKq+BxreZdswyGJVfUFhJXM6KQ+oNcWHCODM5XUzvUkY8x4KiGs6KaNRsU9wBl1GSWMzZlsmXyUgkX52a0nVvmvRtCoNOMOISJIA8DcjwWRntdxeDpc9fIKGKhItbWmqcNwgrmP7RjEnTPdBdRdar5V6uKVSFZgmhIY1ZKbQDRpFEwkJ5/agy4hOTohGx3Kopu5Puq5hcX5V+3R7oZGlL2HnV2LPJrv2IwmW2NTZhJGwrWQAA') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-miniconsarrowrightround:before {
  content: "\ed45";
}
</style>
