<script>
	import {mapState, mapMutations} from 'vuex'; 
	export default {
		onLaunch: function() {
			this.getToken()
		},
		methods:{
			getToken(){
				try {
				    const token = uni.getStorageSync('token');
				    if (token) {
				        this.modifyToken(token)
				    }
				} catch (e) {
				    console.log(e);
				}
			},
			...mapMutations(['modifyToken']),
		},
		computed: {  
		},  
	}
</script>

<style>
	/*每个页面公共css */
</style>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uview-ui/index.scss";
	
	/* ......其他的样式 */
</style>