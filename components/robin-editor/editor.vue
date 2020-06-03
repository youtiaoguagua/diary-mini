<template>
    <view class='wrapper'>
        <!-- <topbar class="header" @cancel="cancel" @save="save" :labelConfirm="labelConfirm" :labelCancel="labelCancel"></topbar> -->
        <view 
		style="margin-top: 0;padding-top: 40rpx;box-sizing: border-box;"
		:style="'height:'+editorHeight+'px;'"
		class="container">
            <editor v-if="!previewMode"  id="editor" class="ql-container" placeholder="开始输入..."
                showImgSize showImgToolbar showImgResize @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
            </editor>
        </view>
        <view class='toolbar' @tap="format"  v-show="keyboardHeight || !autoHideToolbar" :style="'bottom:'+ (isIOS ? keyboardHeight : 0)+'px'">
            <block v-for="(t,i) in tools" :key="i">
                <view v-if="t=='bold'" :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-jiacu"
                    data-name="bold" data-label="加粗"></view>
                <view v-if="t=='align-left'" :class="(formats.align === 'left' || !formats.align) ? 'ql-active' : ''"
                    class="iconfont icon-juzuoduiqi" data-name="align" data-value="left" data-label="居左"></view>
                <view v-if="t=='align-center'" :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
                    data-name="align" data-value="center" data-label="居中"></view>
                <view v-if="t=='align-right'" :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-juyouduiqi"
                    data-name="align" data-value="right" data-label="居右"></view>
                <view v-if="t=='color'" :style="fontColor!='#FFFFFF' ? 'color:'+formats.color : ''" class="iconfont icon-zitiyanse"
                    data-name="color" @tap.stop="openColor"></view>
                <view v-if="t=='image'" class="iconfont icon-tupian" @tap.stop="insertImage"></view>
                <view v-if="t=='undo'" class="iconfont icon-chexiao" @tap="undo"></view>
                <view v-if="t=='redo'" class="iconfont icon-zhongzuo" @tap="redo"></view>
            </block>
        </view>
<!--        <uni-popup ref="popup" type="bottom" @transed="colorPop">
            <colorPicker :color="color" :show="showColor" @confirm="colorChanged" @cancel="colorPopClose"></colorPicker>
        </uni-popup> -->
		<u-popup v-model="showColorPop" mode="bottom" border-radius="14" length="40%">
				<view v-if="showColorPop" style="padding-top: 20rpx;">
					<colorpicker @colorChanged="colorChanged"></colorpicker>
				</view>
		</u-popup>
    </view>
	
</template>

<script>
	import colorpicker from "./colorpicker.vue"
    export default {
        components: {
			colorpicker,
        },
        props: {
            html: {
                type: String
            },
            imageUploader: {
                type: Function
            },
            muiltImage: {
                type: Boolean,
                default: true
            },
            compressImage: {
                type: Boolean,
                default: false
            },
            autoHideToolbar: {
                type: Boolean,
                default: false
            },
            tools: {
                type: Array,
                default: function() {
                    return ['bold','align-left', 'align-center', 'align-right',
                        'color', 'image',"undo","redo"
                    ]
                }
            }
        },
        data() {
            return {
				showColorPop:false,
                show: true,
                readOnly: false,
                formats: {},
                fontColor: "#000000",
                bgColor: "",
                color: "",
                showColor: false,
                htmlData: "",
                keyboardHeight: 0,
                editorHeight: 0,
                isIOS: false,
            }
        },
        mounted: function() {
            const platform = uni.getSystemInfoSync().platform
            this.isIOS = platform === 'ios'
            if (this.previewMode) {
                this.previewData(this.html)
            }
            let keyboardHeight = 0
            this.updatePosition(0)
            uni.onKeyboardHeightChange(res => {
                if (res.height === keyboardHeight) return
                const duration = res.height > 0 ? res.duration * 1000 : 0
                keyboardHeight = res.height
                setTimeout(() => {
                    uni.pageScrollTo({
                        scrollTop: 0,
                        success: () => {
                            this.updatePosition(keyboardHeight)
                            this.editorCtx && this.editorCtx.scrollIntoView()
                        }
                    })
                }, duration)
            })
        },
        methods: {
			save() {
			   this.editorCtx.getContents({
						success:res=>{
							this.$emit("savaContent",res)
						}
					})
			},
            updatePosition(keyboardHeight) {
                const {
                    windowHeight,
                    windowWidth,
                    platform,
					statusBarHeight,
					screenHeight,
                } = uni.getSystemInfoSync()
				let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
                const rpx = windowWidth / 750
                let topbarHeight = 85 * rpx;
                const toolbarHeight = (70 * Math.ceil(this.tools.length / 15) + 1) * rpx

                // const bodyHeight = windowHeight - topbarHeight - 35
				var navbarheight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
				const bodyHeight = screenHeight - statusBarHeight - navbarheight - 44;
                this.keyboardHeight = keyboardHeight
                this.editorHeight = keyboardHeight > 0 ? (bodyHeight - keyboardHeight - toolbarHeight) : (this.autoHideToolbar ?
                    bodyHeight : bodyHeight - toolbarHeight)
            },
            openColor(e) {
                var name = e.currentTarget.dataset.name
                var color = this.formats[name]
                this.colorPickerName = name
                if (name == 'backgroundColor' && !color) {
                    color = "#FFFFFF"
                }
                if (name == 'color' && !color) {
                    color = "#000000"
                }
                this.color = color
				this.showColorPop = true;
                // this.$refs.popup.open({
                //     type: "bottom"
                // })
            },
            colorChanged(color) {
				this.showColorPop = false;
                let label = '颜色'
                this._format("color", color, label + color)
            },
            readOnlyChange() {
                this.readOnly = !this.readOnly
            },
            onEditorReady() {
                uni.createSelectorQuery().in(this).select('#editor').context((res) => {
                    this.editorCtx = res.context
                    if (this.html) {
                        this.editorCtx.setContents({
                            html: this.html
                        })
                    }
                }).exec()
            },
            undo() {
                this.editorCtx.undo()
                this.toast("撤销")
            },
            redo() {
                this.editorCtx.redo()
                this.toast("重做")
            },
            format(e) {
                let {
                    name,
                    value,
                    label
                } = e.target.dataset
                if (!name) return
                this._format(name, value, label)
            },
            _format(name, value, label) {
                this.editorCtx.format(name, value)
                this.toast(label)
            },
            toast(label) {
                uni.showToast({
                    duration: 600,
                    icon: 'none',
                    title: label
                })
            },
            onStatusChange(e) {
                const formats = e.detail
                this.formats = formats
            },
            insertImage() {
				this.updatePosition(0)
                let params = {}
                params.count = this.muiltImage ? 9 : 1
                params.sizeType = this.compressImage ? ['compressed'] : ['original']
                uni.chooseImage({
                    ...params,
                    success: (res) => {
                        res.tempFilePaths.map(path => {
							this.editorCtx.insertImage({
								height:"100%",
								width:"60%",
							    src: path,
							    alt: '图像'
							})
                        })
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "./editor-icon.css";
	
		.grid-text {
			font-size: 28rpx;
			margin-top: 4rpx;
			color: $u-type-info;
		}

    .wrapper {
        // padding: 5px;
        width: 100%;

        .header {
            width: 100%;
            position: fixed;
            z-index: 9;
            left: 0;
            /* #ifndef H5 */
            top: 0;
            /* #endif */
            /* #ifdef H5 */
            top: 44px;
            /* #endif */

        }

        .container {
            width: 100%;
            margin-top: 75rpx;
            // background: #fff;

            .ql-container {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                font-size: 16px;
                line-height: 1.5;
                overflow: auto;
                // padding: 20rpx;
            }
        }

        .toolbar {
            position: fixed;
            width: 100%;
            left: 0;
            bottom: 0;
            box-sizing: border-box;
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            background-color: #fff;
            border-top: 1px solid #eee;
            line-height: 50rpx;
			display: flex;
			justify-content: space-between;

            .iconfont {
                display: inline-block;
                padding: 10rpx 0;
                width: 50rpx;
                text-align: center;
                font-size: 34rpx;
                box-sizing: border-box;
            }
        }
    }





    .preview {
        width: 100%;
        margin-top: 90rpx;

        .previewNodes {
            width: 100%;
        }
    }

    .ql-active {
        color: #06c;
    }
</style>
