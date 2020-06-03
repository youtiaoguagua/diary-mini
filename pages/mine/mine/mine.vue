<template>
	<view class="content">
		<view class="top-image">
			<image src="https://pic.downk.cc/item/5ea91ccbc2a9a83be5fdd310.png" mode="widthFix"></image>
		</view>
		<view class="login-top">
			<view class="userAvatar">
				<image v-show="token==null" src="https://pic.downk.cc/item/5ea9161fc2a9a83be5f6f15d.png" mode=""></image>
				<open-data v-show="token" type="userAvatarUrl"></open-data>
			</view>
			<view class="userNickName">
					<text v-show="token==null">Hi,请登录</text>
					<open-data v-show="token" type="userNickName"></open-data>
			</view>
		</view>
		<view class="not-login" v-if="token==null">
			<image src="https://pic.downk.cc/item/5ea91d21c2a9a83be5fe2ba4.png" mode=""></image>
			<view class="please-login">
				你还没有登录请登录
			</view>
			<button class="button-login shadow-blur" @tap="popupShow=true">登录</button>
		</view>
		<view class="setting" v-else>
			<view class="set" @tap.stop="gotoPage('mydiary')">
				<text>我的文章</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			<view class="set">
				<text>我的分享</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			<view class="set">
				<text>本周心情值</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			<button class="button-set" type="default" open-type="share">
				<text>分享小程序</text>
				<u-icon name="arrow-right"></u-icon>
			</button>
			<button class="button-set" type="default" open-type="contact">
				<text>联系我们</text>
				<u-icon name="arrow-right"></u-icon>
			</button>
		</view>
		<!-- 弹出登录框 -->
		<u-popup v-model="popupShow" mode="bottom" length="26%">
				<view class="popup-content">
					<view class="">
						<view class="please-login">请登录</view>
						<view class="" style="margin: 40rpx 0;">
							<button class="kuaijie-login" open-type="getUserInfo" @getuserinfo="login">微信快捷登录</button>
						</view>
					</view>
					<view class="">
						<view class="xieyi">
							登录即同意《心情日记用户协议》
						</view>
						<view class="xieyi">
							本产品由youtiaoguagua负责运营
						</view>
					</view>
				</view>
		</u-popup>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'; 
	export default {
		data() {
			return {
				popupShow:false,
			}
		},
		onLoad() {

		},
		methods: {
			gotoPage(value){
				if(value=='mydiary'){
					this.$u.route('pages/mine/getMydiary/getMydiary');
				}
			},
			login(e){
				console.log(e);
				let userinfo = e.detail.userInfo;
				uni.login({
				provider: 'weixin',
				  success: (loginRes)=> {
				    this.$u.post('/wx/login', {
				    				  code: loginRes.code,
				    				  info: userinfo
				    			}).then(res => {
									this.popupShow = false;
									this.modifyToken(res.token);
									this.storeToken(res.token)
				    				// uni.reLaunch({
				    				//     url: 'pages/mine/mine/mine'
				    				// });
				    			})
				  }
				});
			},
			storeToken(token){
				uni.setStorage({
				    key: 'token',
				    data: token,
				});
			},
			...mapMutations(['modifyToken']),
		},
		computed:{
			...mapState(["token"])
		}
	}
</script>

<style>
	@import url("./mine.css");
</style>
<style lang="scss" scoped>

</style>
