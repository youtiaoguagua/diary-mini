<template>
	<view class="wrap">
		<u-waterfall v-model="flowList">
			<template v-slot:left="{leftList}">
					<view class="jieyou-warter" v-for="(item, index) in leftList" :key="index" @tap="goDetail(item.id)">
						<view class="jieyou-img-wrap" v-if="item.imageList.length!==0">
							<image class="jieyou-image" :src="item.imageList[0]" mode="widthFix" @tap.stop="previewImage(item.imageList[0])"></image>
						</view>
						<view class="jieyou-title">
							{{item.title}}
						</view>
						<view class="jieyou-auth">
							<view class="avator">
								<image :src="item['userInfo']['avatarUrl']" mode=""></image>
							</view>
							<view class="nickname">
								{{item['userInfo']['nickName']}}
							</view>
						</view>
					</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="jieyou-warter" v-for="(item, index) in rightList" :key="index" @tap="goDetail(item.id)">
					<view class="jieyou-img-wrap" v-if="item.imageList.length!==0">
						<image class="jieyou-image" :src="item.imageList[0]" mode="widthFix"></image>
					</view>
					<view class="jieyou-title">
						{{item.title}}
					</view>
					<view class="jieyou-auth">
						<view class="avator">
							<image :src="item['userInfo']['avatarUrl']" mode=""></image>
						</view>
						<view class="nickname">
							{{item['userInfo']['nickName']}}
						</view>
					</view>
				</view>
			</template>
		</u-waterfall>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'; 
	export default {
		data() {
			return {
				loadStatus: 'loadmore',
				flowList: [],
				list: [],
				nextpage:1,
			}
		},
		onLoad() {
			// this.addRandomData();
			this.getDailyContent();
		},
		onReachBottom() {
			if(this.nextpage==null){
				this.loadStatus = "nomore"
			}else{
				this.loadStatus = "loading"
				this.getDailyContent(this.nextpage)
			}
		},
		methods: {
			getDailyContent(page=1,limit=10){
				this.$u.get("wx/diary/sharelist",{
					page:page,
					limit:limit
				})
				.then(res=>{
					if(this.nextpage==res.page.totalPage){
						this.nextpage = null;
					}else{
						this.nextpage++;
					}
					// this.list = this.list.concat(res.page.list);
					this.flowList = this.flowList.concat(res.page.list);
				})
			},
			goDetail(e){
				if(this.token==null){
					uni.showToast({
						title:"请登录!!",
						icon:"none",
					});
					return
				}
				this.$u.route('/pages/square/jieyou/jieyou', {
					id: e,
				});
			},
			previewImage(url){
				uni.previewImage({
					current:url,
					urls:[url]
				})
			}
		},
		computed: {
			...mapState(["token"])  
		}, 
	}
</script>

<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss" scoped>
	.jieyou-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #FFFFFF;
		padding: 8px;
	}
	
	.jieyou-image {
		width: 100%;
		border-radius: 4px;
	}
	
	.jieyou-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
	}

	.jieyou-auth {
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
		display: flex;
	}
	
	.avator{
		width: 50rpx;
		height: 50rpx;
	}
	
	.avator>image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	
	.nickname{
		font-size: 26rpx;
		display: flex;
		align-items: center;
		margin-left: 10rpx;
	}
</style>