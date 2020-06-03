<template>
	<view class="body">
	  <swiper class="swiper" style="height: 600px;"
	  easing-function="linear"
	   :interval="interval" :duration="duration">
			<swiper-item>
					<Cover1 ref="coverModle" @getCoverEvnImage="getCoverEvnImage" ></Cover1>
			</swiper-item>
		</swiper>
		
		<view class="bottom-item">
			<view class="item">
				<text class="iconfont icon-dayinfengmian"></text>
				<text>修改封面</text>
			</view>
			<view class="item">
				<text class="iconfont icon-paiban"></text>
				<text>修改内容</text>
			</view>
		</view>
	</view>
</template>

<script>
import Cover1 from "./components/cover1.vue"
export default {
	components:{
		Cover1
	},
	data() {
		return {
			coverImage:null,
		};
	},
	onLoad() {
	},
	onReady() {
		// this.getCoverImage()
		// this.generateImage()
	},
	methods: {
		getCoverEvnImage(e){
			debugger
			console.log(e);
		},
		getCoverImage(){
			this.$refs.coverModle.generateImage();
		},
		generateImage(){
				uni.canvasToTempFilePath({
				  x: this.LineWidth/2,
				  y: this.LineWidth/2,
				  width: this.screenWidth - this.LineWidth, 
				  height: this.canvasHeight - this.LineWidth,
				  canvasId: 'firstCanvas',
				  quality:1,
				  success: (res)=> {
				    // 在H5平台下，tempFilePath 为 base64
				    console.log(res.tempFilePath)
					let a = uni.getFileSystemManager().readFileSync(res.tempFilePath, "base64")
					debugger
					this.$emit("getCoverEvnImage",res.tempFilePath)
				  },
				  fail: (res) => {
				  	console.log(res);
				  }
				},this)
			}
	},
};
</script>

<style lang="less">
.body {
	
	.bottom-item{
		position: fixed;
		width: 100%;
		height: 160rpx;
		bottom: 0;
		background-color: #FFFFFF;
		box-shadow: 1px 1px 4px rgba(0,0,0,0.1);
		display: flex;
		justify-content: space-around;
		
		.item{
			flex: 1;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			
			.iconfont{
				font-size: 36rpx;
			}
			
			text:last-child{
				font-size: 24rpx;
				font-weight: 600;
				margin: 10rpx 0;
			}
		}
	}
}
</style>

<style>
page {
	background-color: #f3f4f6;
}

@font-face {font-family: "iconfont";
  src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAANoAAsAAAAAB+AAAAMZAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqDQIMRATYCJAMMCwgABCAFhG0HQBvhBhHVmzPIfhyUY3qm2eMlLn2euTKkOvsdPE869X3dWb6enEQuIMkFpCAoJaANaEIcgVZ3BhqBRmAFwOZm6B/CRyiW5Dz4X76UpGMS8ut/jpkubZScf8FzyUoa7Q1wPKABdV8l2Z3Iifkt4pl2Ujo5k8/rEMDSlM7IyNETZ2LQ4DwBZP6c6jJMxYjuqRQMgkts1chhYhhnj5MGDiW/L5/pKQYcYgpcOjUcVcnQd8O7crU52kxhZGbLenZA3QUK6AxokGLSmYvKkp1RWFup+wtdNIKzViSKEqEjd8U/PHAQEBcsTwDQnqcceNcjEBaqciZ+1VcpAFwgCzgCVxFXGw5D3PcTOqNiva/ZJ63x995vGD/xwEvuu9fAPXp37fFLNnPvhfrusYte1r7LjbIzz13acjn3Xdx8IbuVb+HbZZ1VWhPtoS3KW1pqm9sCL89mz/QqxIonEFRbPBJSUe7l2JBuzU8af52bFc91Ztp+Nzb3rt/S7DYt6yeznCe7s5N3ktn4sGnx6NZUtQyTrZNhyyr/tKyk7vRvnSExZ4RcCT96yeaF7/SKKXOWT6ka9bPF6lFsuhWEqTBAW3WqOhgeEByNjgXHjgfHU4FwBD179pDDIGRPp4nQreAxQ5SewadPoRSAaJN6pjZDtFndSf5CAIHxh5vvLMka+M14GoCXf89egEC0STO+BIMDquj/Eo3s0I4ETUpbwkDoZRQFmG/DgHU8RKC3Jm/nu+tAYReMJmLgEKcJKAytkRrbGWJ4pMDFMAQsnRiz26MWS1GIrgF0ZAeA4HMdHDJ5AAqfp0iNfQMx6vIVXHxRYMmWWkd68G3FnUYwKsEN1j84XTL5FjmllTc076i4LEkoL+TDRWBo+3pmwYy8xorjY0YRAuKSYIbbMMYClYtHLa0VqVPXEfVNrS6pOTGCUQluwPoHnC6Zot5yavz8Dc07Ku5pa3O/kA83ODDQ0o9ALso8qu1ZXnN8zIgIAcQlATPYMYpkASo9yaOWFjsjXic63o3GKtv91en77QMs+FQljijRuIuVW1W+Vqq/y4TZJKdy0wAAAAA=') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-paiban:before {
  content: "\e662";
}

.icon-dayinfengmian:before {
  content: "\e631";
}


</style>
