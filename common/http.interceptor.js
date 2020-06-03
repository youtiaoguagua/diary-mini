const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		// baseUrl: 'http://192.168.123.40:8080/diary',
		baseUrl: 'https://diary.gaobili.cn/diary',
		loadingText: '努力加载中~',
	});
	
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.token = vm.$store.state.token;
		return config;
	}
	
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.code==401){
			// 清空token
			vm.$store.state.token = null;
			uni.removeStorage({
			    key: 'token'
			});
			vm.$u.toast(res.msg);
			setTimeout(() => {
				// 此为uView的方法，详见路由相关文档
				vm.$u.route('pages/mine/mine/mine')
			}, 1000)
			return false;
		}
			return res;
	}
}

export default {
	install
}