<template>
	<view class="content">
		<view class="jieyou">
			<view class="jieyou-content">
				<view class="question">
					<rich-text :nodes="content"></rich-text>
				</view>
				<view class="input-content">
					<view class="fack-input" @tap="ifFocus=true">
						何以解忧
					</view>
				</view>
			</view>
		</view>
		<view class="" v-show="ifFocus" class="keyboard" :style="{bottom:bottom+'px'}">
			<view class="input-send">
				<text style="font-size: 32rpx;color: #3498db;" @tap="blur">取消</text>
				<text @tap="submitComment" class="iconfont icon-plane" style="color: #74b9ff;font-size: 48rpx;"></text>
			</view>
			<textarea v-model="comment" :show-confirm-bar="false" :adjust-position="false" type="text" @blur="blur" placeholder="何以解忧" :focus="ifFocus" />
		</view>
		<u-top-tips ref="uTips"  type="success" duration="1000"></u-top-tips>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle: {
				'background':"#f9ca24",
				'width': '300rpx',
				'height': '100rpx',
				'font-size': '40rpx',
				'color': "black",
				'font-weight': '700',
			},
			contentId:-1,
			content:"",
			ifFocus:false,
			bottom:0,
			comment:"",
		};
	},
	onLoad(e) {
		this.contentId = e.id;
		this.getOneDiary();
	},
	mounted() {
		uni.onKeyboardHeightChange(res => {
				this.bottom = res.height;
			
		  console.log(res.height)
		})
	},
	methods: {
		submitComment(){
			uni.getUserInfo({
			  provider: 'weixin',
			  success: (infoRes)=> {
			    this.postComment(infoRes.userInfo)
			  }
			});

		},
		postComment(userInfo){
			this.$u.post("/wx/comment/save",{
				  "comment": this.comment,
				  "whichDiary": this.contentId,
				  "avatarUrl":userInfo.avatarUrl,
				  "nickName":userInfo.nickName,
			})
			.then(res=>{
				this.comment = "";
				this.showTopTips();
				console.log(res);
			})
		},
		showTopTips(){
			this.$refs.uTips.show({
				title: '提交成功！',
				type:"success",
			})
		},
		blur(){
			this.ifFocus = false;
		},
		getOneDiary(){
			this.$u.get("wx/diary/oneshare/"+this.contentId)
			.then(res=>{
				console.log(res);
				this.content= res.diary.content;
			})
		}
	}
};
</script>

<style>
@import url("./jieyou.css");
</style>
