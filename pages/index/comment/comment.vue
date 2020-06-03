<template>
	<view>
		<view class="comment" v-for="(res, index) in content" :key="res.id">
			<view class="left"><image :src="res.avatarUrl" mode="aspectFill"></image></view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.nickName }}</view>
				</view>
				<view class="content">{{ res.comment }}</view>
			</view>
		</view>
		<u-empty :show="isempty" text="所谓伊人，在水一方"></u-empty>
		<u-loadmore bg-color="rgb(255,255,255)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			commentList: [],
			diaryId:-1,
			nextpage:1,
			loadStatus:"loadmore",//加载更多
			content:[],
			isempty:false,
		};
	},
	onLoad(e) {
		this.diaryId = e.id;
		this.getComment();
	},
	methods: {
		// 跳转到全部回复
		getComment(page=1,limit=10){
			this.$u.get("wx/comment/list",{
				id:this.diaryId,
				page:page,
				limit:limit
			}).then(res=>{
				if(res.page.totalCount==0){
					this.isempty = true;
				}
				if(res.page.totalPage==this.nextpage){
					this.nextpage = null;
				}else{
					this.nextpage++;
				}
				this.content = this.content.concat(res.page.list);
			})
		}
	},
	onReachBottom() {
				 if(this.nextpage==null){
					 this.loadStatus = "nomore"
				 }else{
					 this.loadStatus = "loading"
					 this.getDiary(this.nextpage)
				 }
		
	},
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30rpx;
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.name {
				color: #5677fc;
			}
			.highlight {
				color: #5677fc;
				.num {
					color: #5677fc;
				}
			}
		}
		.content {
			margin-bottom: 10rpx;
		}
	}
}
</style>
