<template>
	<view class="body">
		<view class=""  :style="{'visibility':modalShow?'hidden':'none'}">
			<canvas style="width: 100%; height:600px;" :style="{ height: canvasHeight + 'px' }"
			@touchstart="touchstart" canvas-id="firstCanvas">
			</canvas>
		</view>
		
			<u-modal v-model="modalShow" :content-slot="true" @confirm="confirm" 
			:async-close="true"
			:mask-close-able="true"
			ref="uModal"
			:show-cancel-button="true"
			 >
				<cover-view class="slot-content diy-input" style="z-index: 1000000000;">
					<input type="text" value="" :placeholder="getInputPlace" v-if="nowSelect!=='cover'" 
					v-model="inputContent">
					<u-upload ref="uUpload" :auto-upload="false" 
					max-count="1"
					@on-choose-complete="onChooseComplete"
					 v-else ></u-upload>
				</cover-view>
			</u-modal>
			
			<view class="">
				<button type="default" @tap="generateImage" >sdadsa</button>
			</view>
	</view>
</template>

<script>
let ctx = null;
import Modal from "./modal.vue"
export default {
	components:{
		Modal
	},
	data() {
		return {
			screenWidth: null,
			canvasHeight: 500,
			LineWidth:16,
			coverContent:{
				bookName:"Hello World",
				author:"油条瓜瓜",
				yiyan:"生如夏花之绚烂，死如秋叶之静美。",
				cover:"https://p.pstatp.com/origin/fe920002be1beea36c6f"
			},
			domPosition:[],
			modalShow:false,
			nowSelect:null,
			inputContent:"",
		};
	},
	created() {
		ctx = uni.createCanvasContext('firstCanvas',this);
		uni.getSystemInfo({
			success: res => {
				this.screenWidth = res.screenWidth-10;
					this.drawImage();
					this.downloadImage();
			}
		});
	},
	onReady() {
	},
	methods: {
		//确定选择
		confirm(){
			this.coverContent[this.nowSelect] = this.inputContent
			if(this.inputContent !== "" ||this.coverContent.tmpcover!==""){
				if(this.nowSelect=="cover"){
					this.coverContent.cover = this.coverContent.tmpcover
					this.$refs.uUpload.remove(0)
				}
				this.drawImage();
				this.putIntoImage(this.coverContent.cover);
				this.inputContent = ""
				this.coverContent.tmpcover = ""
				this.modalShow = false
			}
			this.modalShow = false
		},
		// 选择图片
		onChooseComplete(e){
			this.coverContent.tmpcover = e[0].url;
		},
		// 画出背景
		drawImage() {
			// 设置背景颜色
			ctx.rect(0, 0, this.screenWidth, this.canvasHeight);
			ctx.setFillStyle('#ffffff');
			ctx.fill();
			//设置边框
			ctx.setStrokeStyle('rgba(255, 121, 121,0.6)');
			ctx.setLineWidth(this.LineWidth);
			ctx.strokeRect(0, 0, this.screenWidth, this.canvasHeight);
			
			//设置书籍文字
			let data;
			data  = this.setText(this.coverContent.bookName,300,20)
			data["type"]=  'bookName';
			this.domPosition.push(data)
			//设置作者名称
			data = this.setText(this.coverContent.author,330,12)
			data["type"]=  'author';
			this.domPosition.push(data)
			//设置一段话
			data = this.setText(this.coverContent.yiyan, this.canvasHeight-70,12)
			data["type"]=  'yiyan';
			this.domPosition.push(data)
			
		},
		//设置文字
		setText(text,height,fontsize){
			ctx.setTextAlign('center')
			ctx.setFillStyle("#000000")
			ctx.setFontSize(fontsize)
			ctx.fillText(text,  this.screenWidth/2,height)
			let textLength = ctx.measureText(text).width
			let x = (this.screenWidth-textLength)/2;
			let y =  height;
			let offten  = 20;
			return {x:x-offten,y:y-offten,xw:x+textLength+offten,yh:y+offten};
		},
		// 下载图片
		downloadImage() {
			uni.downloadFile({
				url: this.coverContent.cover,
				success: res => {
					// console.log(res.tempFilePath);
					this.putIntoImage(res.tempFilePath)
				}
			});
		},
		// 导入图片
		putIntoImage(image){
			ctx.save();
			ctx.beginPath();
			// ctx.setGlobalAlpha(0.8);
			ctx.drawImage(image, 0 + this.LineWidth/2, 0 + this.LineWidth/2, this.screenWidth - this.LineWidth, this.canvasHeight*(1/2));
			ctx.draw();
			let data = {
				x: 0 + this.LineWidth/2,
				y: 0 + this.LineWidth/2,
				xw: this.screenWidth - this.LineWidth,
				yh: this.canvasHeight*(1/2),
			};
			data["type"]=  'cover';
			this.domPosition.push(data);
			
		},
		// 触摸
		touchstart(e) {
			let nowPo = e.touches[0];
			for(let item of this.domPosition ){
				if(nowPo.x < item.xw && nowPo.x > item.x){
					if (nowPo.y < item.yh && nowPo.y > item.y){
						// console.log(item.type);
						this.modalShow = true;
						this.nowSelect = item.type
						console.log(item);
						break
					}
				}
			}
		},
		// 生成图片
		generateImage(){
			uni.canvasToTempFilePath({
			  x: this.LineWidth/2,
			  y: this.LineWidth/2,
			  width: this.screenWidth - this.LineWidth, 
			  height: this.canvasHeight - this.LineWidth,
			  canvasId: 'firstCanvas',
			  quality:1,
			  success: (res)=> {
			    // 在H5平台下，tempFilePath 为 base64
			    console.log(res.tempFilePath)
				let a = uni.getFileSystemManager().readFileSync(res.tempFilePath, "base64")	
			  },
			  fail: (res) => {
			  	console.log(res);
			  },
			  complete: (res) => {
				  console.log(res);
			  	
			  }
			},this)
		}
	},
	computed:{
		getInputPlace(){
			let name = ""
			if(this.nowSelect=="bookName"){
				name = "书名"
			}else if(this.nowSelect=="author"){
				name = "作者"
			}else if(this.nowSelect=="yiyan"){
				name = "一句话"
			}
			return "请输入"+name
		}
	}
};
</script>

<style lang="less">
.body {
	padding: 10rpx;
	
	.diy-input{
		padding: 30rpx;
		display: flex;
		justify-content: center;
		
		input{
			width: 100%;
		}
	}
}
</style>

<style>
page {
	background-color: #f3f4f6;
}
</style>
