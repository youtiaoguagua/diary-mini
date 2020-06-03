import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
// import uView from "@/uview";
// import "@/uview/index.scss"
// Vue.use(uView);
import uView from 'uview-ui'
Vue.use(uView)


//引入时间组件
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;

//引入表情包
import {mood} from "@/components/moodData.js"
Vue.prototype.moodData = mood;

//分享
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

// 引入vuex
import store from '@/store';

const app = new Vue({
	store,
    ...App
})
app.$mount()

import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)
