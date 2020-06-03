<template>
	<view class="content">
		<view class="content-title">
			<view class="title">
				{{diaryContent.title}}
			</view>
			<view class="update-time">
				{{formatDateTime(diaryContent.updateTime)}}
			</view>
		</view>
		<view class="content-body">
			<rich-text :nodes="diaryContent.content"></rich-text>
		</view>
		  <view class="bootom-bar">
		  	<view class="" @tap="changeDiary">
				<u-icon name="edit-pen" color="#606266" size="34"></u-icon>
		  		<text>编辑</text>
		  	</view>
			<view class="" @tap="showModal=true">
				<u-icon name="trash" color="#606266" size="34"></u-icon>
				<text>删除</text>
			</view>
			<view class="" @tap="showModalShare=true">
				<u-icon name="share" color="#606266" size="34"></u-icon>
				<button @tap.stop v-if="diaryContent.share==1" open-type='share'>分享</button>
				<text v-else>分享</text>
			</view>
			<view class="" @tap="LookComment">
				<u-icon name="chat" color="#606266" size="34"></u-icon>
				<text>评论</text>
			</view>
		  </view>
		  	<u-toast ref="uToast" />
		  	<u-modal v-model="showModal" :show-cancel-button="true"
			@confirm="deleteDiary" @cancel="showModal=false" content="确定删除吗!"></u-modal>
			
		  	<u-modal v-model="showModalShare" :show-cancel-button="true"
			@confirm="shareDiary" @cancel="showModalShare=false" content="你当前的日记没有开启分享是否开启？"></u-modal>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'; 
	export default {
		data() {
			return {
				showModal:false,
				showModalShare:false,
				html:"阿斯顿撒即可打开链接撒肯定就拉萨机打赏",
				diaryId:0,
			}
		},
		onLoad(e) {
			this.diaryId = this.diaryContent.id;
			// this.diarycontent = diaryContent
			
		},
		methods: {
			LookComment(){
				// 查看评论
				this.$u.route({
						url: 'pages/index/comment/comment',
						params: {
							id:this.diaryId
						}
					})
			},
			changeDiary(){
				this.$u.route({
						url: 'pages/index/makenote/makenote',
						params: {
							moodIndex: this.diaryContent.mood,
							type:"update"
						}
					})
			},
			shareDiary(){
				this.showModalShare = false;
				this.diaryContent.share = 1;
				this.$u.put("/wx/diary/update",this.diaryContent);
				//TODO
			},
			deleteDiary(){
				this.$u.delete('/wx/diary/delete',[this.diaryId])
				.then(res => {
					this.modifydiaryIsChange(true);
					this.showToast();
					// uni.navigateBack({
					// });
				})
			},
			showToast() {
				this.$refs.uToast.show({
					title: '删除成功',
					type: 'success',
					isTab:true,
					duration:600,
					url:"pages/index/home/home"
				})
			},
			formatDateTime(datetime){
				return this.dayjs(datetime).format("YYYY年MM月DD日 HH:mm:ss")
			},
			...mapMutations(['modifydiaryIsChange']),
		},
		computed:{
			...mapState(['diaryContent'])
		}
	}
</script>

<style>
@import url("./viewnote.css");
</style>
