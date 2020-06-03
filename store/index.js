import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		countDownBgImage: null,//倒计时图片
		token:null,
		diaryIsChange:false,//修改完日记或者写了一篇日记
		diaryContent:null,//传递到查看单个日记的对象
		countDown:null,
		countDownIsChange:false,
	},
	mutations: {
		// payload为用户传递的值，可以是单一值或者对象
		modifyCountDownBgImage(state, url) {
			state.countDownBgImage = url;
		},
		modifyToken(state,token){
			state.token = token;
		},
		modifydiaryIsChange(state,type){
			state.diaryIsChange = type;
		},
		modifydiaryContent(state,content){
			state.diaryContent = content;
		},
		modifycountDown(state,countdown){
			state.countDown = countdown;
		},
		modifycountDownIsChange(state,countDownIsChange){
			state.countDownIsChange = countDownIsChange;
		}
	},
	getters: {
		getCountDownBgImage: state => {
			return state.countDownBgImage;
		}
	},
})

export default store