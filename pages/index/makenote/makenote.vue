<template>
    <view class="content" :style="{'background':'#ffffff'}">
		<view>
			<!-- navbar -->
			<u-navbar :background="{'background':'rgba(0,0,0,0)'}" 
			:border-bottom="false" :is-back="false">
				<view class="slot-wrap">
					<view class="" @tap="goBack">
						退出
					</view>
					<view class="" @tap="getMeditor">
						保存
					</view>
					<view class="">
						<u-checkbox-group >
									<u-checkbox 
										v-model="share" 
										name="share"
										shape="circle"
									>开启分享</u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="content-body">
			<!-- 标题 -->
			<input type="text" value="" v-model="title" placeholder="标题(选填)" class="title-input" />
			<!-- 正文 -->
			<meditor  class="editor" 
					@savaContent="saveEditor" 
					:html="html"
					 ref="mymeditor">
			</meditor>
			
		</view>
		<!-- 左侧拖动 -->
		  <drag-button :isDock="true"
		             :existTabBar="true"
					 :imageurl="drgImage"
					 :html="html"
					 @btnClick="btnClick"></drag-button>
			<!-- 心情选择 -->			
		<u-popup v-model="showPopup" mode="bottom" length="60%" border-radius="14">
				<view style="padding: 20rpx;box-sizing: border-box;height: 100%;">
					<MoodSelect @selectMoonList="selectMoonList"></MoodSelect>
				</view>
			</u-popup>
			<!-- 提交检验提示 -->
			<u-toast ref="uToast" />

    </view>
</template>


<script>
    import meditor from '@/components/robin-editor/editor.vue';
	 import dragButton from "@/components/drag-button/drag-button.vue";
	 import MoodSelect from './components/selectMood.vue';
	import md5Libs from "uview-ui/libs/function/md5";
	 import {mapState, mapMutations} from 'vuex'; 
    export default {
        components: {
            meditor,
			dragButton,
			MoodSelect
        },
        data() {
            return {
				showModal:false,
				backgroundColor:"#ffffff",
				showPopup:false,
                showEditor:true,
				rootData:this.moodData,
				drgImage:"",
				imageList:[],//要保存的图片列表
				discriptionText:"",//描述信息
				title:"",//标题
				content:"",//编辑的文本信息
				moodId:"-1",//表情id
				html:"",
				share:false,
				whichType:"insert",//当前是更新还是保存
            }
        },
		 onLoad(e) {
			 if(e.type=="update"){
				 this.whichType = "update"
				 this.html = this.diaryContent.content;
				 this.title = this.diaryContent.title;
				 this.share = this.diaryContent.share==0?false:true;
			 }
			if(e.moodIndex!=="-1"&&e.moodIndex!==undefined){
				this.moodId = e.moodIndex;
				this.selectMoonList(e.moodIndex)
			}else{
				// this.showPopup = true;
			}
		},
        methods: {
			getMeditor(){
				this.$refs.mymeditor.save();
			},
			saveAllToServer(){
				this.modifydiaryIsChange(true);
				if(this.whichType == "insert"){
					this.insertChange()
				}else if(this.whichType == "update"){
					this.updateChange();
				}

			},
			async saveEditor(e){
				if(!this.vaildValue(e)){
					return;
				}
				let text = e.text.replace(/\n/g,"");
				text = text.substring(0,50);
				this.discriptionText = text;
				
				let asignure = await this.$u.get("/wx/miniapp/sign")
				for(let op of e.delta.ops){
					let imageUrl = op.insert.image;
					if(imageUrl!==undefined&&(imageUrl.startsWith("http://tmp")||imageUrl.startsWith("wxfile"))){
						let filepath = this.dayjs().format("YYYY/MM/DD")
						let file_name = md5Libs.md5(imageUrl)+ imageUrl.substring(imageUrl.lastIndexOf('.'));
						let fileurl = `${filepath}/${file_name}`
						let resUrl = "https://dailyimg.gaobili.cn/"+fileurl
						e.html = e.html.replace(imageUrl,resUrl)
						if(this.imageList.length<4){
							this.imageList.push(resUrl)
						}
						this.uploadImage(imageUrl,fileurl,asignure)
					}
				}
				this.content = e.html;
				//保存日记
				// this.showModal= true;
				this.saveAllToServer();
				console.log(e);
			},
			insertChange(){
				this.$u.post('/wx/diary/save', {
					"share":this.share?1:0,
					  "content": this.content,
					  "discription": this.discriptionText,
					  "imageList": this.imageList,
					  "mood": this.moodId,
					  "title": (this.title===""||this.title==null)?this.dayjs().format("YYYY年MM月DD日"):this.title,
					}).then(res => {
						this.ShowToast()
					})
			},
			updateChange(){
				this.$u.put("/wx/diary/update", {
					"id":this.diaryContent.id,
					"share":this.share?1:0,
					  "content": this.content,
					  "discription": this.discriptionText,
					  "imageList": this.imageList,
					  "mood": this.moodId,
					  "title": (this.title===""||this.title==null)?this.dayjs().format("YYYY年MM月DD日"):this.title,
					}).then(res => {
						this.ShowToast()
					})
			},
			ShowToast(){
				this.$refs.uToast.show({
					title: '保存成功！！',
					type: 'success',
					isTab:true,
					duration:600,
					url:"pages/index/home/home"
				})
			},
			vaildValue(e){
				if(this.moodId==="-1"){
					this.$refs.uToast.show({
						title: '选择一下当前的心情吧！！',
						type: 'error',
					})
					return false;
				}
				if(e.delta.ops.length==1&&e.delta.ops[0].insert=="\n"){
					this.$refs.uToast.show({
						title: '你还什么都没有输入呢！！',
						type: 'error',
					})
					return false;
				}
				return true;
			},
			selectMoonList(e){
				this.moodId = e; 
				this.drgImage = `/static/mood/${this.rootData[e].icon}.png`;
				this.backgroundColor = this.rootData[e].color;
				this.showPopup = false;
			},
			btnClick(){
				this.showPopup = this.showPopup?false:true;
			},
			goBack(){
				uni.navigateBack({
				});
			},
			uploadImage(url,filepath,asignure){
				
				uni.uploadFile({
					url: 'https://dailyimg.gaobili.cn/', //仅为示例，非真实的接口地址
					filePath: url,
					name:'file',
					  formData: {
						"name":url,
						'key': filepath,
						"policy": asignure['policy'],
						"OSSAccessKeyId": asignure['accessid'],
						"success_action_status": "200",
						"signature": asignure['signature'],
					  },
					success: (uploadFileRes) => {
						console.log(uploadFileRes);
					}
				});
			},
			...mapMutations(['modifydiaryIsChange']),
        },
		computed: {
			...mapState(['diaryContent'])  
		}, 
    }
</script>

<style>
@import url("./makenote.css");
</style>
