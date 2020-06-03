<template>
	<view class="content">
		<view class="navbar">
			<view class="navbar-image" style="background-image: url(https://pic.downk.cc/item/5ea45600c2a9a83be512d458.jpg);">
				
			</view>
		</view>
		<view class="content-body">
			<view class="timeline">
				<view class="timeline-item" v-for="(item,index) in content" :key="index">
					<view class="timeline-date">
						<view class="timeline-datetime">
							<view class="year">
								{{formatDateTime(item.updateTime,'year')}}
							</view>
							<view class="date">
								{{formatDateTime(item.updateTime,'date')}}
							</view>
						</view>
					</view>
					<view class="timeline-content">
						<view class="timeline-body" @tap="gotoViewDaily(item.id,index)">
							<view class="title">
								{{item.title}}
							</view>
							<view class="note">
								{{item.discription}}
							</view>
							<view class="picture">
								<view :style="{'background-image':' url('+image+')'}" 
								v-for="(image,key) in item.imageList"  @tap.stop="previewImage(image,item.imageList)"
								:key="key"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		 <uni-fab horizontal="right"
		            vertical="bottom"
		            direction="horizontal"
					:content="fabcontent"
					:showMenu="showMenu"
					@trigger="getXuanfu"
					@fabClick="fabClick"
		        ></uni-fab>
			<u-loadmore bg-color="rgb(255,255,255)" :status="loadStatus"></u-loadmore>
	</view>
</template>

<script>
	import uniFab  from "@/components/uni-fab/uni-fab.vue";
	import {mapState, mapMutations} from 'vuex'; 
	export default {
		components:{
			uniFab,
		},
		data() {
			return {
				loadStatus:"loadmore",//加载更多
				bgimage:"https://pic.downk.cc/item/5e96b40dc2a9a83be58e4bdf.jpg",
				showMenu:false,
				content:[],
				nextpage:1,
				fabcontent:[
					{
						iconPath:"/static/customer.png",
						text:"自定义",
						id:"-1",
					},
					{
						iconPath:"/static/mood/angry.png",
						text:"生气",
						id:'1',
					},
					{
						iconPath:"/static/mood/expressionless.png",
						text:"面无表情",
						id:"10"
					},
					{
						iconPath:"/static/mood/happy3.png",
						text:"露齿开心",
						id:"15"
					}
				]
			}
		},
		onLoad() {
			if(this.token==null){
				this.setFuckData()
			}else{
				this.getDiary();
			}
		},
		onShow() {
			if(this.$store.state.diaryIsChange){
				this.nextpage = 1;
				this.content=[];
				this.getDiary();
				this.modifydiaryIsChange(false)
			}
		},
		onHide() {
			
		},
		methods: {
			getDiary(page=1,limit=10){
				this.$u.get('/wx/diary/list', {
								page:page,
								limit:limit
							}).then(res=>{
								if(res.page.totalPage==this.nextpage){
									this.nextpage = null;
								}else{
									this.nextpage++;
								}
								this.content = this.content.concat(res.page.list);
								if(this.content.length==0){
									this.setFuckData();
								}
							})
			},
			fabClick(){
				this.showMenu = true
			},
			getXuanfu(e){
				if(this.token==null){
					uni.showToast({
						title:"请登录!!",
						icon:"none",
					});
					this.showMenu = false;
					return
				}
				this.showMenu = false;
				this.$u.route('/pages/index/makenote/makenote', {
					moodIndex: e.item.id,
				});
			},
			previewImage(image,imageList){
				uni.previewImage({
					current:image,
				    urls: imageList,
				});
				},
			formatDateTime(datetime,type){
				if(type==="year"){
					return this.dayjs(datetime).format('YYYY/MM')
				}else{
					return this.dayjs(datetime).format('DD')
				}
			},
			// 设置示例数据
			setFuckData(){
				this.content = [
					{
						id:-1,
						title:"[示例]给时光以生命，给岁月以文明",
						discription:"知我者，谓我心忧；不知我者，谓我何求。",
						imageList:[
							"https://pic.downk.cc/item/5ea93f23c2a9a83be523c65b.png",
							"https://pic.downk.cc/item/5ea93f23c2a9a83be523c665.jpg",
							"https://pic.downk.cc/item/5ea93f23c2a9a83be523c65e.jpg",
						],
						updateTime:"2020-05-01 7:49:29"
					},
					{
						id:-1,
						title:"[示例]南唐旧梦：山河永寂",
						discription:"嗟叹红颜泪、英雄殁，人世苦多。山河永寂、怎堪欢颜。",
						imageList:[
							"https://pic.downk.cc/item/5ea93f23c2a9a83be523c662.jpg",
							"https://pic.downk.cc/item/5ea9403dc2a9a83be5250bfc.jpg",
						],
						updateTime:"2020-04-30 10:49:49"
					},
					{
						id:-1,
						title:"[示例]待至暮年归,挽手戏落日.",
						discription:"对自己有自信时，不能对别人说「期待」。所谓的「期待」是放弃时的托词，因为别无选择。若缺少这种无奈感，这个词就太虚伪了。",
						imageList:[
							"https://pic.downk.cc/item/5ea9403dc2a9a83be5250be5.jpg",
							"https://pic.downk.cc/item/5ea9403dc2a9a83be5250bed.png",
							"https://pic.downk.cc/item/5ea9403dc2a9a83be5250bf4.png",
							],
						updateTime:"2020-04-29 8:20:49"
					},
					{
						id:-1,
						title:"[示例]望海潮·东南形胜",
						discription:"有三秋桂子，十里荷花。",
						imageList:[
								"https://pic.downk.cc/item/5ea9409fc2a9a83be52574d3.png",
								"https://pic.downk.cc/item/5ea9409fc2a9a83be52574bb.jpg"
							],
						updateTime:"2020-04-28 10:49:49"
					}
				]
			},
			gotoViewDaily(id,index){
				if(id==-1){
					uni.showToast({
						title:"这个是示例哦!!",
						icon:"none",
					});
					return
				}
				if(this.token==null){
					uni.showToast({
						title:"请登录!!",
						icon:"none",
					});
					return
				}
				this.modifydiaryContent(this.content[index])
				this.$u.route({
							url: 'pages/index/viewnote/viewnote'
				})
			},
			...mapMutations(['modifydiaryIsChange',"modifydiaryContent"]),
		},
		computed: {  
			...mapState(['diaryIsChange',"token"])  
		}, 
		 onReachBottom() {
			 if(this.token==null){
				 this.loadStatus = "nomore"
				 return
			 }
			 if(this.nextpage==null){
				 this.loadStatus = "nomore"
			 }else{
				 this.loadStatus = "loading"
				 this.getDiary(this.nextpage)
			 }
		 	
		 },
		 watch:{
			 token:function(newd, old) {
				 if(old==null&&newd!==null){
					 this.content = [];
					 this.getDiary();
				 }else if(newd==null){
					 this.content = null;
					 this.setFuckData()
				 }
			 }
		 }
	}
</script>

<style>
@import url("./home.css");
</style>


<style lang="scss" scoped>

</style>