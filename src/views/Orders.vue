<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<el-row style="margin-top: 20px;">
				<el-input placeholder="请输入内容" v-model="searchQuery" style="width: 30%;" @change="getOrderData" clearable>
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</el-row>
			<el-row style="margin-top: 20px;">
				<el-table :data="orderData" style="width: 100%" border>
					<el-table-column type="index" label="#" width="70">
					</el-table-column>
					<el-table-column prop="order_number" label="订单编号" width="220">
					</el-table-column>
					<el-table-column prop="order_price" label="订单价格" width="180">
					</el-table-column>
					<el-table-column  label="是否支付" width="180">
						<template v-slot="scope">
							<el-tag type="success" v-if="scope.row.orderpay">{{scope.row.orderpay?'已支付':'未付款'}}</el-tag>
							<el-tag type="danger" v-if="!scope.row.orderpay">{{scope.row.orderpay?'已支付':'未付款'}}</el-tag>
							
						</template>
					</el-table-column>
					<el-table-column prop="is_send" label="是否发货" width="180">
					</el-table-column>
					<el-table-column label="下单时间">
						<template v-slot="scope">
							{{moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<el-row style="margin-top: 20px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
					:current-page.sync="pagenum" :page-sizes="[3,5,10,15]" :page-size="pagesize"
					layout="sizes, prev, pager, next" :total="total" style="">
				</el-pagination>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				orderData:[],//列表数据
				searchQuery: '', //搜索参数
				pagenum:1,
				pagesize:5,
				total:0,
				
			}
		},
		created() {
			this.getOrderData()
		},
		methods: {
			getOrderData() {
				if(this.searchQuery){
					this.$message('搜索功能尚未开发完善')
					return
				}
				this.$https.get('orders', {
					params: {
						query: this.searchQuery,
						pagenum: this.pagenum,
						pagesize: this.pagesize
					}
				}).then(res =>{
					console.log(res);
					this.orderData = res.data.data.goods
					this.total = res.data.data.total
				})
			},
			moment(time){
				return moment(time)
			},
			handleSizeChange(newSize){
				this.pagesize = newSize
				this.getOrderData()
			},
			handleCurrentChange(){
				this.getOrderData()
			}
		}
	}
</script>

<style scoped>

</style>
