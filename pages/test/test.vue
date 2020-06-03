<template>
	<view>
		<aa @test="test"></aa>
	</view>
</template>

<script>
	import aa from "./components/aa.vue"
	export default{
		components:{
			aa
		},
		data() {
			return {
			}
		},
		onLoad() {
			
		},
		methods:{
			test(e){
				console.log(e);
			}
		}
	}
</script>