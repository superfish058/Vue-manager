<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<!-- 警告文案 -->
			<el-row>
				<el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon>
				</el-alert>
			</el-row>
			<!-- 级联选择器 -->
			<el-row style="margin-top: 20px;">
				<el-cascader v-model="cateIdQuery" :options="categories" :props="{ expandTrigger: 'hover',value:'cat_id',
					label:'cat_name',children:'children' }" @change="cateQueryChange">
				</el-cascader>
				<el-button type="primary" style="margin-left: 15px;" @click="showAddCateForm">添加参数
				</el-button>
			</el-row>

			<el-row style="margin-top: 20px;">
				<!-- 标签页 -->
				<el-tabs v-model="cateSel" @tab-click="handleClick">
					<!-- 动态参数页 -->
					<el-tab-pane label="动态参数" name="many">
						<el-table :data="categoriesInfo" style="width: 100%" border="">
							<el-table-column type="expand" width="70">
								<template v-slot="scope">
									<!-- 标签 -->
									<span v-for="item,index in scope.row.attr_vals.split(' ')" :key="index">
										<el-tag closable style="margin-left: 15px;" v-if="item.trim()">
											{{item}}
										</el-tag>
									</span>
									<!-- 添加标签 -->
									<div style="margin-left: 15px;display: inline-block;">
										<el-input v-if="scope.row.inputVisible" v-model="inputValue"
											style="width: 100px;" ref="saveTagInput" size="small"
											@keyup.enter.native="handleInputConfirm(scope.row)"
											@blur="handleInputConfirm(scope.row)">
										</el-input>
										<el-button v-else size="small" @click="showInput(scope.row)">+ New Tag
										</el-button>
									</div>
								</template>
							</el-table-column>
							<el-table-column type="index" width="70" label="#">
							</el-table-column>
							<el-table-column prop="attr_name" label="参数名称" width="500">
							</el-table-column>
							<el-table-column  label="操作">
								<template v-slot="scope">
									<el-button type="primary" size="small" @click="attredit(scope.row)"><i
											class="el-icon-edit"></i>编辑</el-button>
									<el-button type="danger" size="small" @click="attrDelete(scope.row)"><i
											class="el-icon-delete"></i>删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<!-- 静态属性页 -->
					<el-tab-pane label="静态属性" name="only">
						<el-table :data="categoriesInfo" style="width: 100%" border="">
							<el-table-column type="expand" width="70">
								<template v-slot="scope">
									<!-- 标签 -->
									<span v-for="item,index in scope.row.attr_vals.split(' ')" :key="index">
										<el-tag closable style="margin-left: 15px;" v-if="item.trim()">
											{{item}}
										</el-tag>
									</span>
									<!-- 添加标签 -->
									<div style="margin-left: 15px;display: inline-block;">
										<el-input v-if="scope.row.inputVisible" v-model="inputValue"
											style="width: 100px;" ref="saveTagInput" size="small"
											@keyup.enter.native="handleInputConfirm(scope.row)"
											@blur="handleInputConfirm(scope.row)">
										</el-input>
										<el-button v-else size="small" @click="showInput(scope.row)">+ New Tag
										</el-button>
									</div>
								</template>
							</el-table-column>
							<el-table-column type="index" width="70" label="#">
							</el-table-column>
							<el-table-column prop="attr_name" label="参数名称" width="500">
							</el-table-column>
							<el-table-column prop="" label="操作">
								<template v-slot="scope">
									<el-button type="primary" size="small" @click="attredit(scope.row)"><i
											class="el-icon-edit"></i>编辑</el-button>
									<el-button type="danger" size="small" @click="attrDelete(scope.row)"><i
											class="el-icon-delete"></i>删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-row>

		</el-card>
		<!-- 添加参数对话框 -->
		<el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close="resetForm('addCateForm')">
			<el-form ref="addCateForm" :model="addCate" label-width="80px" :rules="addCateRules">
				<el-form-item label="参数名称" prop="name">
					<el-input v-model="addCate.name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitaddCateForm('addCateForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑参数对话框 -->
		<el-dialog title="提示" :visible.sync="editCateDialogVisible" width="50%" @close="resetForm('editCateForm')">
			<el-form ref="editCateForm" :model="editCate" label-width="80px" :rules="addCateRules">
				<el-form-item label="参数名称" prop="name">
					<el-input v-model="editCate.name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submiteditCateForm('editCateForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				categories: [], //商品分类数据
				categoriesInfo: [], //分类参数数据
				cateIdQuery: [],
				cateSel: 'many', //默认静态参数
				inputValue: '', //添加标签输入数据
				addCate: {
					name: ''
				}, //添加参数对象
				addCateDialogVisible: false, //添加对象对话框
				addCateRules: {
					name: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}]
				},
				editCateDialogVisible: false, //编辑对象对话框
				editCate: {
					name: '',
					attrId: ''
				}, //编辑参数对象

			}
		},
		created() {
			this.getCategories()
		},
		methods: {
			//删除分类参数
			attrDelete(row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$https.delete(`categories/${this.cateIdQuery.slice(-1)[0]}/attributes/${row.attr_id}`)
						.then(res => {
							if (res.data.meta.status == 200) {
								this.$message({
									type: 'success',
									message: '删除成功!'
								})
								this.getCategoriesInfo()
							} else {
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
			//提交编辑参数表单
			submiteditCateForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$https.put(
							`categories/${this.cateIdQuery.slice(-1)[0]}/attributes/${this.editCate.attrId}`, {
								attr_name: this.editCate.name,
								attr_sel: this.cateSel,
								attr_vals: this.editCate.attr_vals
							}).then(res => {
							console.log(res);
							if (res.data.meta.status == 200) {
								this.$message.success('编辑参数成功')
								this.getCategoriesInfo()
							} else {
								this.$message.error('编辑参数失败')
							}
						})
						this.editCateDialogVisible = false
					} else {
						return false;
					}
				})

			},
			//编辑分类参数
			attredit(row) {
				console.log(row);
				this.editCate.name = row.attr_name
				this.editCate.attrId = row.attr_id
				this.editCate.attr_vals = row.attr_vals
				this.editCateDialogVisible = true
			},
			//展示添加分类菜单对话框
			showAddCateForm() {
				if (this.cateIdQuery.length != 3) {
					this.$message('只能选择三级节点哦')
					return
				}
				this.addCateDialogVisible = true
			},
			//提交添加参数表单
			submitaddCateForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$https.post(`categories/${this.cateIdQuery.slice(-1)[0]}/attributes`, {
							attr_name: this.addCate.name,
							attr_sel: this.cateSel
						}).then(res => {
							if (res.data.meta.status == 201) {
								this.$message.success('添加分类参数成功')
								this.getCategoriesInfo()
							}
						})
						this.addCateDialogVisible = false
					} else {
						return false;
					}
				})

			},
			//离开重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//确认
			handleInputConfirm(row) {
				if (this.inputValue.trim()) {
					row.attr_vals += (' ' + this.inputValue)
					this.addCateAttr(row.attr_id,row.attr_name, row.attr_vals)
				}
				this.inputValue = ''
				row.inputVisible = false

			},
			//添加参数标签
			addCateAttr(id, name, list) {
				this.$https.put(`categories/${this.cateIdQuery.slice(-1)[0]}/attributes/${id}`, {
					attr_name: name,
					attr_sel: this.cateSel,
					attr_vals: list
				}).then(res => {
					console.log(res);
					if (res.data.meta.status == 200) {
						this.$message.success('添加参数成功')
					} else {
						this.$message.error('添加参数失败')
					}
				})
			},
			//点击添加按钮
			showInput(row) {
				row.inputVisible = true;
				this.$nextTick(() => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			//切换标签页
			handleClick() {
				this.getCategoriesInfo()
			},
			//获取选中节点id
			cateQueryChange() {
				this.getCategoriesInfo()
			},
			//获取商品分类
			async getCategories() {
				const {
					data: res
				} = await this.$https.get('categories')
				this.categories = res.data
			},
			//获取分类参数
			async getCategoriesInfo() {
				if (this.cateIdQuery.length != 3) {
					this.categoriesInfo = []
					this.$message('只能选择三级节点哦')
					return
				}
				let cateId = this.cateIdQuery.slice(-1)[0]
				const {
					data: res
				} = await this.$https.get(`categories/${cateId}/attributes`, {
					params: {
						sel: this.cateSel
					}

				})
				res.data.forEach(item => {
					item['inputVisible'] = false
				})
				this.categoriesInfo = res.data
			},
		}
	}
</script>

<style scoped lang="less">

</style>
