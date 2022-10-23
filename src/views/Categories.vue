<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<!-- 添加分类 -->
			<el-row style="margin-bottom: 20px;">
				<el-button type="primary" @click="addCateVisible=true">添加分类</el-button>
			</el-row>
			<!-- 数据展示 -->
			<el-row>
				<el-table :data="CateData" style="width: 100%" row-key="cat_id" border
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column label="#  分类名称" width="300">
						<template slot-scope="scope">
							<span v-if="scope.row.index" style="margin-right: 10px;">
								{{scope.row.index}}
							</span>
							{{scope.row.cat_name}}
						</template>
					</el-table-column>
					<el-table-column label="是否有效" width="300">
						<template slot-scope="scope">
							<i class="el-icon-check" v-if="!scope.row.cat_deleted"></i>
							<i class="el-icon-close" v-if="scope.row.cat_deleted"></i>
						</template>
					</el-table-column>
					<el-table-column label="排序" width="300">
						<template slot-scope="scope">
							<el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
							<el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
							<el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="small" @click="showEditCategories(scope.row)"><i
									class="el-icon-edit"></i>编辑</el-button>
							<el-button type="danger" size="small" @click="showDeleteCategories(scope.row.cat_id)"><i
									class="el-icon-delete"></i>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<!-- 分页组件 -->
			<el-row style="margin-top: 20px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page.sync="pagenum" :page-sizes="[3,5,10,15]" :page-size="pagesize"
					layout="sizes, prev, pager, next" :total="total" background>
				</el-pagination>
			</el-row>

		</el-card>
		<!-- 添加分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="addCateVisible" width="40%" @close=" resetForm('addCateForm')">
			<el-form label-width="80px" :model="addCateInfo" :rules="cateAddRule" ref="addCateForm">
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="addCateInfo.name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-cascader :options="CateDataMini" :props="{ checkStrictly: true,value:'cat_id',
						label:'cat_name',children:'children'}" clearable expand-trigger="hover" style="width: 100%;"
						v-model="addCateInfo.level"></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitAddCateForm('addCateForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="editCateVisible" width="40%" @close=" resetForm('editCateForm')">
			<el-form label-width="80px" :model="editCateInfo" :rules="cateAddRule" ref="editCateForm">
				<el-form-item label="分类id">
					<el-input v-model="editCateInfo.id" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="editCateInfo.name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCateVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditCateForm('editCateForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//商品分类数据
				CateData: [],
				type: 3,
				pagenum: 1,
				pagesize: 5,
				total: 0,
				addCateVisible: false, //添加分类对话框标识符
				editCateVisible: false, //编辑分类对话框显示标识符
				addCateInfo: {
					name: '',
					level: []
				},
				editCateInfo: {
					name: '',
					id: ''
				},
				CateDataMini: [], //分类数据简化版
				//添加分类规则
				cateAddRule: {
					name: [{
						required: true,
						message: '请输入父类名称',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.getCategories()
		},
		methods: {
			showDeleteCategories(id) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$https.delete(`categories/${id}`).then(res =>{
						if(res.data.meta.status == 200){
							this.getCategories()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}else{
							this.$message.error('删除失败')
						}
					})
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//编辑分类表单
			submitEditCateForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.editCateVisible = false
						this.editCategories()
					} else {
						return false;
					}
				});
			},
			//
			editCategories() {
				this.$https.put(`categories/${this.editCateInfo.id}`, {
					cat_name: this.editCateInfo.name
				}).then(res => {
					console.log(res);
					if (res.data.meta.status == 200) {
						this.$message.success('修改分类成功')
						this.getCategories()
					} else {
						this.$message.error('修改分类失败')
					}
				})
			},
			//展示编辑分类表单
			showEditCategories(data) {
				this.editCateVisible = true
				this.editCateInfo = {
					name: data.cat_name,
					id: data.cat_id
				}
			},
			//提交添加分类表单
			submitAddCateForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.addCateVisible = false
						this.addCategories()
					} else {
						return false;
					}
				});
			},
			//size改变
			handleSizeChange(newSize) {
				this.pagesize = newSize
				this.getCategories()
			},
			//page改变
			handleCurrentChange(newPage) {
				this.pagenum = newPage
				this.getCategories()
			},
			//退出重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.addCateInfo.level = []
			},
			//添加分类
			addCategories() {
				this.$https.post('categories', {
					cat_pid: this.addCateInfo.level.slice(-1)[0] ? this.addCateInfo.level.slice(-1)[0] : 0,
					cat_name: this.addCateInfo['name'],
					cat_level: this.addCateInfo.level.length ? this.addCateInfo.level.length : 0
				}).then(res => {
					if (res.data.meta.status == 201) {
						this.$message.success('添加父类成功')
						this.getCategories()
					} else {
						this.$message.error('添加失败')
					}
				})
			},
			//获取商品分类数据
			async getCategories() {
				const {
					data: res
				} = await this.$https.get('categories', {
					params: {
						type: this.type,
						pagenum: this.pagenum,
						pagesize: this.pagesize
					}
				})
				this.CateData = res.data.result
				this.total = res.data.total
				let CateDataMini = JSON.parse(JSON.stringify(res.data.result))
				this.CateData.forEach((item, index) => {
					this.CateData[index]['index'] = index + (this.pagenum - 1) * (this.pagesize) + 1
					CateDataMini.forEach((item, index) => {
						if (item.children) {
							item.children.forEach((it, ind) => {
								if (it.children) {
									delete CateDataMini[index].children[ind].children
								}
							})
						}
					})
				})
				this.CateDataMini = CateDataMini

			}
		}
	}
</script>

<style scoped>

</style>
