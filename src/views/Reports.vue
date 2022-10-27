<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>
		<div id="main" style="height: 400px;width: 800px;"></div>
	</div>
</template>

<script>
	import * as echarts from 'echarts';
	export default {
		data() {
			return {
				options: {
					title: {
						text: '用户来源'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#E9EEF3'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value'
					}]
				}
			}
		},
		async mounted() {
			let myChart = echarts.init(document.getElementById('main'));
			const {
				data: res
			} = await this.$https.get('reports/type/1')
			this.options = {...this.options,...res.data}
			console.log(res);
			myChart.setOption(this.options);
		}

	}
</script>

<style scoped>

</style>
