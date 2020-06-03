<template>
	<view class="content">
				<u-checkbox-group @change="checkboxGroupChange">
					<view class="one-content" v-for="(item, index) in content" :key="index" >
						<view class="checkbox-item">
							<u-checkbox :name="item.id" v-model="item.ischecked"></u-checkbox>
						</view>
						<view class="content-item">
							<view class="datetime">
								{{item.updateTime}}
							</view>
							<view class="title">
								{{item.title}}
							</view>
							<view class="discription">
								{{item.discription}}
							</view>
							<view class="image-list" v-if="item.imageList.length>0">
								<image :src="image" mode="center" v-for="(image,key) in item.imageList"></image>
							</view>
						</view>
					</view>
				</u-checkbox-group>
				<u-loadmore bg-color="rgb(255,255,255)" :status="loadStatus"></u-loadmore>
				<view class="" style="height: 110rpx;width: 100%;">
					
				</view>
				<view class="content-bottom">
					<view>
						<text @tap="showModel=true" class="delete" v-if="deleteList.length>0">删除</text>
					</view>
					<view class="">
						共{{totalDiary}}日记
					</view>
				</view>
				
				<u-modal v-model="showModel" content="确定要删除吗!!" :show-cancel-button="true" @confirm="deleteDiary"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus:"loadmore",//加载更多
				nextpage:1,
				content:[],
				totalDiary:0,
				deleteList:[],
				showModel:false,
			}
		},
		onLoad() {
			this.getDiary();
		},
		methods: {
			checkboxGroupChange(e){
				this.deleteList = e;
				console.log(e);
			},
			deleteDiary(){
				this.$u.delete('/wx/diary/delete',this.deleteList)
				.then(res => {
					this.content = [];
					this.deleteList = []
					this.getDiary()
					uni.showToast({
						title: '删除成功!!',
						icon:"none"
					});
				})
			},
			getDiary(page=1,limit=10){
				this.$u.get('/wx/diary/list', {
					page:page,
					limit:limit
				}).then(res=>{
					res.page.list.forEach(item=>{
						item.ischecked = false;
					})
					if(res.page.totalPage==this.nextpage){
						this.nextpage = null;
					}else{
						this.nextpage++;
					}
					this.totalDiary = res.page.totalCount;
					this.content = this.content.concat(res.page.list);
					if(this.content.length==0){
						this.setFuckData();
					}
				})
			},
		},
		onReachBottom() {
			 if(this.nextpage==null){
				 this.loadStatus = "nomore"
			 }else{
				 this.loadStatus = "loading"
				 this.getDiary(this.nextpage)
			 }
			
		},
	}
</script>

<style>
@import url("./getMydiary.css");
</style>
