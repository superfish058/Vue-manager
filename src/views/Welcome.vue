<template>
	<div>
		<p v-for="i in 1" :key="i">
			欢迎使用hz后台管理系统
		</p>
		
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style scoped>
	p{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 22px;
		letter-spacing: 1px;
	}
</style>