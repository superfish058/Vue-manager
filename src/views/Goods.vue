<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<!-- 搜索内容&添加商品-->
			<el-row>
				<el-input placeholder="请输入内容" v-model="searchQuery" style="width: 300px;" @change="getGoodsList"
					clearable @clear="getGoodsList">
					<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
				</el-input>
				<el-button type="primary" style="margin-left: 20px;" @click = "turnAddPage">添加商品</el-button>
			</el-row>
			<!-- 内容展示区 -->
			<el-row style="margin-top: 20px;">
				<el-table :data="goodsList" border style="width: 100%">
					<el-table-column type="index" label="#" width="60">
					</el-table-column>
					<el-table-column prop="goods_name" label="商品名称" width="430">
					</el-table-column>
					<el-table-column prop="goods_price" label="价格(元)" width="150">
					</el-table-column>
					<el-table-column prop="goods_weight" label="商品重量" width="130">
					</el-table-column>
					<el-table-column label="创建时间" width="240">
						<template v-slot="scope">
							{{setDate(scope.row.add_time)}}
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template v-slot="scope">
							<el-button type="primary" size="small" @click="attredit(scope.row)"><i
									class="el-icon-edit"></i>编辑</el-button>
							<el-button type="danger" size="small" @click="attrDelete(scope.row)"><i
									class="el-icon-delete"></i>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<!-- 分页区 -->
			<el-row style="margin-top: 20px;">
				<el-pagination @size-change="sizeChange" @current-change="getGoodsList" background
					:current-page.sync="pagenum" :page-sizes="[3,5,10,15]" :page-size="pagesize"
					layout="sizes, prev, pager, next" :total="total">
				</el-pagination>
			</el-row>
		</el-card>
		<!-- 编辑商品对话框 -->
		<el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
				<el-form-item label="商品ID">
					<el-input v-model="editForm.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="商品名称" prop="goods_name">
					<el-input v-model="editForm.goods_name"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="goods_price">
					<el-input v-model="editForm.goods_price"></el-input>
				</el-form-item>
				<el-form-item label="数量" prop="goods_number">
					<el-input v-model="editForm.goods_number"></el-input>
				</el-form-item>
				<el-form-item label="重量" prop="goods_weight">
					<el-input v-model="editForm.goods_weight"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				searchQuery: '', //搜索内容
				pagesize: 5, //页码大小
				pagenum: 1, //页码
				total: 0, //总数
				goodsList: [], //商品列表
				editForm: {
					goods_name: '',
					goods_price: '',
					goods_number: '',
					goods_weight: '',
				}, //编辑表单
				editDialogVisible: false, //编辑表单显示标识
				editRules: {
					goods_weight: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					goods_name: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
				}

			}
		},
		created() {
			this.getGoodsList()
		},
		methods: {
			//跳转添加页面
			turnAddPage(){
				this.$router.push('add')
			},
			//提交编辑表单
			submitEditForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$message('由于接口不完善，此功能不能使用')
						this.editDialogVisible = false
					} else {
						return false;
					}
				})

			},
			//删除商品
			attrDelete(row) {
				this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$https.delete(`goods/${row.goods_id}`).then(res=>{
						if(res.data.meta.status == 200 ){
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.getGoodsList()
						}else{
							this.$message.error('删除失败')
						}
					})
				})
			},
			//编辑参数
			attredit(row) {
					this.editForm = {
						id:row.goods_id,
						goods_name: row.goods_name,
						goods_price: row.goods_price,
						goods_number: row.goods_number,
						goods_weight: row.goods_weight,
					} //编辑表单
				this.editDialogVisible = true
			},
			//获取商品列表
			getGoodsList() {
				this.$https.get('goods', {
					params: {
						query: this.searchQuery,
						pagesize: this.pagesize,
						pagenum: this.pagenum
					}
				}).then(res => {
					console.log(res);
					this.total = res.data.data.total
					this.goodsList = res.data.data.goods
				})
			},
			//设置时间
			setDate(time) {
				return moment(time).format('YYYY-MM-DD HH:mm:ss')
			},
			sizeChange(newSize) {
				this.pagesize = newSize
				this.getGoodsList()
			}
		}
	}
</script>

<style scoped lang="less">

</style>
