<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<!-- 提示信息 -->
			<el-row>
				<el-alert title="添加商品信息" type="info" center show-icon>
				</el-alert>
			</el-row>
			<!-- 步骤条 -->
			<el-row style="margin-top: 20px;">
				<el-steps :space="200" :active="Number(tabName)" finish-status="success" align-center>
					<el-step title="基本信息"></el-step>
					<el-step title="商品参数"></el-step>
					<el-step title="商品属性"></el-step>
					<el-step title="商品图片	"></el-step>
					<el-step title="商品内容"></el-step>
					<el-step title="完成"></el-step>
				</el-steps>
			</el-row>
			<el-row style="margin-top: 20px;padding-bottom: 20px;">
				<el-form :model="addForm" :rules="addRules" ref="addForm" label-width="80%" label-position="top">
					<el-tabs tab-position="left" :before-leave="leaveTabs" v-model="tabName">
						<el-tab-pane label="基本信息" name="0">
							<el-form-item label="商品名称" prop="goods_name">
								<el-input v-model="addForm.goods_name"></el-input>
							</el-form-item>
							<el-form-item label="商品价格" prop="goods_price">
								<el-input v-model="addForm.goods_price"></el-input>
							</el-form-item>
							<el-form-item label="商品数量" prop="goods_number">
								<el-input v-model="addForm.goods_number"></el-input>
							</el-form-item>
							<el-form-item label="商品重量" prop="goods_weight">
								<el-input v-model="addForm.goods_weight"></el-input>
							</el-form-item>
							<el-form-item label="商品分类" prop="goods_cat">
								<el-cascader :options="cateList" v-model="addForm.goods_cat" @change="handleChange"
									:props="{expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}">
								</el-cascader>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品参数" name="1">
							<el-form-item :label="item.attr_name" v-for="item,index in cateAttrList" :key="index">
								<el-checkbox-group v-model="checkList">
									<el-checkbox :label="it" v-for="it,ind in item.attr_vals.split(',')" :key="ind"
										border checked></el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品属性" name="2">
							<el-form-item :label="item.attr_name" v-for="item,index in cateAttrListOnly" :key="index">
								<el-input v-model="item.attr_vals"></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane label="商品图片" name="3">
							<el-upload action="https://lianghj.top:8888/api/private/v1/upload"
								:on-preview="handlePreview" :on-remove="handleRemove" :headers="hearderObj"
								list-type="picture" :on-success="uploadSuccess">
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
							</el-upload>
						</el-tab-pane>
						<el-tab-pane label="商品内容" name="4">
							<el-form-item label="商品介绍">
								<el-input type="textarea" :rows="5" v-model="addForm.goods_introduce">
								</el-input>
							</el-form-item>
							<el-button type="primary" style="margin-top: 20px;" @click="submitAddForm('addForm')">
								添加商品
							</el-button>
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</el-row>
		</el-card>
		<!-- 图片预览 -->
		<el-dialog title="提示" :visible.sync="picVisible" width="50%">
			<el-image :src="picUrl"></el-image>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				addForm: {
					goods_name: '商品名',
					goods_price: 1,
					goods_weight: 0,
					goods_number: 0,
					goods_cat: [],
					goods_introduce: ''

				}, //添加表单
				checkList: [],
				tabName: 0,
				cateList: [], //分类列表
				addRules: {
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goods_price: [{
						required: true,
						message: '请输入价格',
						trigger: 'blur'
					}],
					goods_number: [{
						required: true,
						message: '请输入数量',
						trigger: 'blur'
					}],
					goods_weight: [{
						required: true,
						message: '请输入重量',
						trigger: 'blur'
					}],
					goods_cat: [{
						required: true,
						message: '请选择分类',
						trigger: 'blur'
					}]
				},
				cateAttrList: [], //参数列表
				cateAttrListOnly: [], //属性列表
				pics: [], //图片暂存
				hearderObj: {
					Authorization: window.sessionStorage.getItem('token')
				},
				picVisible: false, //图片对话框
				picUrl: '', //图片地址
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			//提交表单
			submitAddForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let submitForm = JSON.parse(JSON.stringify(this.addForm))
						submitForm.goods_cat = submitForm.goods_cat.join(',')
						submitForm['pics'] = this.pics
						submitForm['attrs'] =[]
						this.cateAttrList.forEach(item =>{
							const newinfo ={
								attr_id:item.attr_id,
								attr_value:item.attr_vals
							}
							submitForm['attrs'].push(newinfo)
						})
						this.cateAttrListOnly.forEach(item =>{
							const newinfo ={
								attr_id:item.attr_id,
								attr_value:item.attr_vals
							}
							submitForm['attrs'].push(newinfo)
						})
						this.$https.post('goods',submitForm).then(res =>{
							console.log(res);
							if(res.data.meta.status == 201){
								this.$message.success('添加商品成功')
								this.$router.push('goods')
							}else{
								this.$message(res.data.meta.msg)
							}
						})
					} else {
						return false;
					}
				});
			},
			//图片预览
			handlePreview(file) {
				this.picUrl = file.response.data.url
				this.picVisible = true
			},
			//移除图片
			handleRemove(file) {
				console.log(file);
				let index = this.pics.findIndex(item => {
					item == file.response.data.tmp_path
				})
				console.log(index);
				this.pics.splice(index, 1)
			},
			//获取商品分类列表
			getCateList() {
				this.$https.get('categories').then(res => {
					this.cateList = res.data.data
				})
			},
			//切换标签页
			changeTab() {
				return false
			},
			//级联选择器选中
			handleChange() {
				if (this.addForm.goods_cat.length != 3) {
					this.$message('只能选择三级节点')
					this.addForm.goods_cat = []
				}
			},
			//离开标签页
			leaveTabs(nextTab) {
				if (nextTab != 0 && this.addForm.goods_cat.length != 3) {
					this.$message('请填写全部参数')
					return false
				}
				if (nextTab == 1) {
					this.$https.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
						params: {
							sel: 'many'
						}
					}).then(res => {
						this.cateAttrList = res.data.data
					})
				}
				if (nextTab == 2) {
					this.$https.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
						params: {
							sel: 'only'
						}
					}).then(res => {
						this.cateAttrListOnly = res.data.data
					})
				}
			},
			//上传成功
			uploadSuccess(res) {
				console.log(res);
				this.pics.push({
					pic: res.data.tmp_path
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.el-checkbox {
		margin: 0 10px;
	}
</style>
