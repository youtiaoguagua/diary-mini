<template>
	<view class="content">
		<!-- 顶部自定义navbar -->
		<u-navbar :is-back="false" :background="{ background: 'rgba(255,255,255,1)' }" :border-bottom="false">
			<view class="nav-bar" @tap="navBack">
				<u-icon name="arrow-left" :bold="true" size="38"></u-icon>
			</view>
		</u-navbar>
		<view class="content-body">
			<view class="content-title">
				<view class="title">
					选择背景图片
				</view>
				<view class="button" @tap.stop="refeshImage">
					<text class="icon-refresh iconfont"></text>
				</view>
			</view>
			<view class="content-discription">
				<view class="">
					{{hitokoto.hitokoto}}
				</view>
				<view class="">
					——{{hitokoto.from}}
				</view>
			</view>
			<view class="content-pictures">
				<view class="picture" v-for="(item,index) in picturelist" :key="index"
				:style="{'background-image':'url('+item+')'}" @tap="selectPicture(index,item)">
					<view class="picture-zhezhao" v-if="selected==item">
						<u-icon name="heart-fill" color="#f9ca24" size="50"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-button-top">
			<view class="bottom-button" @tap="determinPic">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations,mapGetters } from 'vuex'; 
	export default {
		data() {
			return {
				hitokoto:{
					hitokoto:"世界上最美丽的就是世界本身!",
					from:"youtiao"
				},
				picturelist:[
				],
				selected:"",
				// test
				loadingImg:"https://pic.downk.cc/item/5ea3db69c2a9a83be5803933.jpg",
				errorImg:"https://pic.downk.cc/item/5ea3db69c2a9a83be5803933.jpg",
			}
		},
		onLoad() {
			this.getHitokoto();
			this.getImageList()
		},
		methods: {
			refeshImage(){
				uni.startPullDownRefresh()
			},
			getImageList(){
				this.$u.get("/wx/image/list")
				.then(res=>{
					this.picturelist=[];
					uni.stopPullDownRefresh()
					res.images.forEach(item=>{
						this.picturelist.push(item.image)
					})
				})
			},
			determinPic(){
				// 确定图片
				this.modifyCountDownBgImage(this.selected);
				this.navBack();
			},
			selectPicture(index,item){
				// 选择图片
				this.selected = item;
			},
			navBack() {
				uni.navigateBack({});
			},
			getHitokoto(){
				// 得到一言
				this.$u.get('https://v1.hitokoto.cn').then(res => {
					this.hitokoto = res;
				});
			},
			...mapMutations(['modifyCountDownBgImage']),
		},
		    onPullDownRefresh() {
		        this.getImageList();
		    }
	}
</script>

<style>
@import url("./pictureSquare.css");
</style>
