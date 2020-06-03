<template>
	<view class="content">
		<view class="gloabstyle" :style="{ 'background-image': 'url(' + backgroundImage + ')'}">
			
		</view>
		<!-- <image :src="backgroundImage" mode=""></image> -->
		<!-- 顶部自定义navbar -->
		<u-navbar :is-back="false" :background="{ background: 'rgba(0,0,0,0)' }" :border-bottom="false">
			<view class="nav-bar" @tap="navBack"><u-icon name="arrow-left" :bold="true" size="38"></u-icon></view>
		</u-navbar>
		<view class="content-body">
			<view class="content-title">
				<text>创建倒计时</text>
				<view class="">
					<u-button @click="saveCountDownBefore" shape="circle" :ripple="true" ripple-bg-color="#f6e58d" :custom-style="customStyle">保存</u-button>
					</view>
			</view>
			<view class="content-input">
				<view class="">
					<input type="text" v-model="title" maxlength="20" value="" placeholder="标题" />
					<text class="title">标题</text>
				</view>
				<view class="">
					<textarea v-model="remakes"
					 :auto-height="true" :show-confirm-bar="false" value="" placeholder="备注" />
					<text class="title">备注</text>
				</view>
				<view class="">
					<view class="input-date" @tap="onShowDatePicker">
						{{dateTime}}
					</view>
					<text class="title">日期</text>
				</view>
				<view class="">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox value="iszhiding" :checked="false" />置顶
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="content-bottom">
				<text>预览</text>
				<view class="preview-card">
					<view class="card-content">
						<view v-if="title">{{title}}</view>
						<view v-else style="color: #606266;">标题</view>
						<text>{{dateTime}}</text>
					</view>
					<view class="card-number">
						23
					</view>
				</view>
				<view class="bottom-button">
					<u-button @click="showCheckBox" shape="circle" :ripple="true" ripple-bg-color="#f6e58d" :custom-style="customStyle">更换背景</u-button>
				</view>
			</view>
		</view>
			<u-toast ref="uToast" />
		<mx-date-picker
			:show="showPicker"
			type="datetime"
			:value="dateTime"
			:show-tips="true"
			color="#f9ca24"
			@confirm="onSelected"
			@cancel="onSelected"
		/>
	</view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import {mapState, mapMutations,mapGetters } from 'vuex'; 
export default {
	components: {
		MxDatePicker
	},
	data() {
		return {
			backgroundImage: 'https://pic.downk.cc/item/5ea2ac66c2a9a83be575577a.jpg',
			customStyle: {
				background: '#f9ca24',
				
				height: '60rpx',
				'font-size': '28rpx',
				color: 'black'
			},
			remakes:"",
			title:"",
			checked:false,
			showPicker: false,
			dateTime:this.dayjs().format('YYYY/MM/DD HH:mm'),
			type:"insert",
		};
	},
	onLoad(e) {
		if(e.type=="update"){
			console.log(this.countDown);
			this.type = e.type;
			this.checked = this.countDown.isTop==1?true:false;
			this.title = this.countDown.title;
			this.remakes = this.countDown.remarks;
			this.dateTime = this.countDown.datetime;
		}else{
			this.getRandomImage();
		}
	},
	methods: {
		saveCountDownBefore(){
			debugger
			if(this.title==""||this.title==null){
				this.$refs.uToast.show({
					title: '标题未填写！！',
					type: 'warning',
				})
			}else{
				if(this.type=="insert"){
					uni.requestSubscribeMessage({
					  tmplIds: ['H-2VG_N3rLCwRbQs7sAr0x8_a67JCTL_46rCqWiukBI'],
					  success:(res)=> { 
						  if(res["H-2VG_N3rLCwRbQs7sAr0x8_a67JCTL_46rCqWiukBI"]=="accept"){
							  this.saveCountDown();
						  }else{
							  uni.showToast({
							  	title: '你必须要选择确定!!',
								icon:"none"
							  });
						  }
					  },
					 fail:(res)=>{
						 console.log(res);
					 }
					})
					
				}else if(this.type=="update"){
					this.updateCountDown()
				}
			}
		},
		saveCountDown(){
			// 保存倒计时
			this.$u.post("/wx/countdown/save",{
				"datetime": this.dateTime,
				"isTop": this.checked?1:0,
				"remarks": this.remakes,
				"title": this.title,
				"image":this.backgroundImage
			}).then(res=>{
				this.modifycountDownIsChange(true)
				this.navBack();
			})
		},
		updateCountDown(){
			this.$u.put("/wx/countdown/update",{
				"id":this.countDown.id,
				"datetime": this.dateTime,
				"isTop": this.checked?1:0,
				"remarks": this.remakes,
				"title": this.title,
				"image":this.backgroundImage
			})
			.then(res=>{
				this.modifycountDownIsChange(true)
				this.navBack();
			})
		},
		getRandomImage(){
			this.$u.get("/wx/image/random")
			.then(res=>{
				this.backgroundImage = res.image.image;
			})
		},
		showCheckBox(){
			uni.showActionSheet({
			    itemList: ["精选图片"],
			    success:(res)=> {
					if(res.tapIndex==0){
						uni.navigateTo({
							url: '/pages/countdown/pictureSquare/pictureSquare',
						});
					}else{
						uni.chooseImage({
						    count: 1, 
						    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: ['album'], //从相册选择
						    success:(res)=> {
								let paths =res.tempFilePaths
								this.modifyCountDownBgImage(paths[0])
						        console.log(paths);
						    }
						});
					}
			    }
			});
		},
		checkboxChange(e) {
			// 选中置顶
			if(e.detail.value[0]=="iszhiding"){
				this.checked = true;
			}else{
				this.checked = false;
			}
		},
		onShowDatePicker(type) {
			//显示
			this.showPicker = true;
		},
		onSelected(e) {
			//时间选择后

			if(e){
				const selectDate = this.dayjs(e.value)
				const nowDate = this.dayjs().subtract(1, 'hour')
				var dif = selectDate.diff(nowDate) 
				if(dif<0){
					this.showToast();
					return;
				}
				
				this.dateTime = e.value;
			}
			this.showPicker = false;

		},
		showToast() {
			this.$refs.uToast.show({
				title: '选择不合法！！',
				type: 'warning ',
			})
		},
		navBack() {
			uni.navigateBack({});
		},
		...mapMutations(['modifyCountDownBgImage',"modifycountDownIsChange"]),
	},
	computed:{
		getGloabImage(){
			if(this.getCountDownBgImage!==null){
				this.backgroundImage = this.getCountDownBgImage
			}
		},
		...mapState(['countDown']),
		...mapGetters([
			'getCountDownBgImage'
		])
	}
};
</script>

<style>
@import url('./addDown.css');
</style>
