<template>
		<view class="content" :style="{'background-image': 'url('+backgroundImage+')',}">
			<u-navbar :is-back="false" :background="{'background':'rgba(0,0,0,0)'}" :border-bottom="false">
				<view class="nav-bar" @tap="gotoPage()">
					<image src="../../../static/plus.png" mode="" ></image>
				</view>
			</u-navbar>
			<view class="content-body">
				<view class="content-top" @longpress.stop="SelectCountDown('top')">
					<view class="countdown-body">
						<view class="countdown-number">
							{{TopCountDown.count}}
						</view>
						<view class="countdown-content">
							{{TopCountDown.title}}
						</view>
						<view class="countdown-time">
							{{formatDate(TopCountDown.datetime)}}
						</view>
					</view>
				</view>
				<view class="content-bottom">
					<scroll-view scroll-y="true" class="scroll-view">
						<view class="scroll-view-item" v-for="(item,index) in countDownList" :key="index" @longpress.stop="SelectCountDown('bottom',item.id,index)">
							<view class="scroll-content">
								<view class="title">
									{{item.title}}！！！
								</view>
								<view class="date">
									{{formatDate(item.datetime)}}
								</view>
							</view>
							<view class="scroll-number">
								{{item.count}}
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<u-modal v-model="modelShow" :show-cancel-button="true" @confirm="deleteCountDOwn" content="确定要删除吗!"></u-modal>
			<u-action-sheet :list="actionlist" @click="actionClick" v-model="actionshow"></u-action-sheet>
		</view>
</template>

<script>
	import {mapState, mapMutations,mapGetters } from 'vuex'; 
export default {
	data() {
		return {
			backgroundImage:"https://pic.downk.cc/item/5ea2ac66c2a9a83be575577a.jpg",
			pattern: {
				buttonColor: '#ffffff'
			},
			countDownList:[],
			TopCountDown:{},
			modelShow:false,
			actionlist:[{
					text: '置顶',
				}, {
					text: '编辑'
				}, {
					text: '删除'
				}],
			actionshow:false,
			selectId:[-1,-1],
		};
	},
	onLoad() {
		if(this.token){
			this.getCountDown();
		}else{
			// 没有登录
			this.addFuckData();
			
		}
	},
	onShow() {
		if(this.countDownIsChange){
			this.getCountDown();
			this.modifycountDownIsChange(false)
		}
	},
	methods: {
		SelectCountDown(type,id,index){
			if(this.token==null){
				uni.showToast({
					title: '请登录!',
					icon:"none",
				});
				return
			}
			this.actionshow = true;
			if(type=="bottom"){
				this.selectId = [id,index];
			}else if(type=="top"){
				this.selectId = [this.TopCountDown.id,-1];
			}
			
			
		},
		updateToTop(){
			// 置顶
			let data = null;
			if(this.selectId[1]==-1){
				data = this.TopCountDown;
			}else{
				data = this.countDownList[this.selectId[1]];
			}
			data.isTop = 1;
			this.$u.put("/wx/countdown/update",data)
			.then(res=>{
				this.getCountDown()
				console.log(res);
			})
		},
		reEditor(){
			// 编辑
			let which = null
			if(this.selectId[1]==-1){
				which = this.TopCountDown;
			}else{
				this.countDownList[this.selectId[1]];
			}
			this.modifycountDown(which)
			this.$u.route({
				url: 'pages/countdown/addDown/addDown',
				params: {
					type: 'update'
				}
			})
		},
		deleteCountDOwn(){
			// 删除
			this.$u.delete("/wx/countdown/delete",[this.selectId[0]])
			.then(res=>{
				this.getCountDown()
				uni.showToast({
				    title: '删除成功!',
				    duration: 1000
				});
			})
		},
		actionClick(e){
			console.log(e);
			if(e==0){
				this.updateToTop()
			}else if(e==1){
				this.reEditor()
			}else if(e==2){
				this.modelShow = true;
			}
		},
		getCountDown(){
			this.$u.get("/wx/countdown/list")
			.then(res=>{
				//清空列表
				this.countDownList = [];
				this.TopCountDown={};
				// 分类数据
				res.countdown.forEach(item=>{
					if(item.isTop==1){
						this.TopCountDown = item;
					}else{
						this.countDownList.push(item)
					}
				})
				if(Object.keys(this.TopCountDown).length==0 ){
					Object.assign(this.TopCountDown, this.countDownList[0]);
					this.countDownList.splice(0,1);
					
				}
				this.backgroundImage =this.TopCountDown.image;
				if(res.countdown.length==0){
					this.addFuckData();
				}
			})
		},
		formatDate(e){
			return this.dayjs(e).format("YYYY年MM月DD日 HH:mm")
		},
		addFuckData(){
			this.TopCountDown = {
				count:60,
				title:"[示例]高考要开始了",
				datetime:"2020/07/7 10:22"
			}
			this.countDownList = [
				{
					count:289,
					title:"[示例]农历春节",
					datetime:"2021/01/24 10:22"
				},
				{
					count:12,
					title:"[示例]中考",
					datetime:"2020/07/7 10:22"
				},
				{
					count:100,
					title:"[示例]小程序发布",
					datetime:"2020/07/7 10:22"
				}
			]
		},
		gotoPage(){
			if(this.token==null){
				uni.showToast({
					title:"请登录!!",
					icon:"none",
				});
				return
			}
			uni.navigateTo({
				url: '/pages/countdown/addDown/addDown',
			});
		},
		...mapMutations(["modifycountDownIsChange","modifycountDown"])
	},
	computed: {
		...mapState(["countDownIsChange","token"])
	},
	watch:{
		 token:function(newd, old) {
			 if(old==null&&newd!==null){
				 this.content = [];
				 this.getCountDown();
			 }
		 }
	}
};
</script>

<style>
@import url("./countdown.css");
</style>
