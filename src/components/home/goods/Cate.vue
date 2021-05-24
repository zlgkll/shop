<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showaddCateDialog">添加分类</el-button>
      <!-- 商品分类列表，树形表格 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index index-text="#" border :show-row-hover="false">
        <!-- 自定义模板列，用插槽，slot-scope得到父组件的数据 -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success valid_icon" v-if="scope.row.cat_deleted === false" style="color: #12ce16"></i>
          <i class="el-icon-error valid_icon" v-else style="color: #ff2e34"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 列表分页 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="parentCateChange"
                  clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data() {
      return {
        // 获取商品分类列表请求参数
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类列表数据
        catelist: [],
        // 总数据条数
        total: 0,
        // 树形表格配置
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
           //自定义模板列配置
          {
            label: '是否有效',
            //模板
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'sort'
          },
          {
            label: '操作',
            type: 'template',
            template: 'option'
          },
        ],
        // 添加分类对话框显示和隐藏
        addCateDialogVisible: false,
        // 添加分类表单数据
        addCateForm: {
          cat_name: '',  //分类名称
          cat_pid: 0,  //父级分类id
          cat_level: 0  //分类等级
        },
        // 添加分类表单验证规则
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        // 父级分类列表
        parentCateList: [],
        // 选中的父级分类的id数组
        selectedKeys: [],
        // 级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',  //鼠标悬停展开
          checkStrictly: true,  //每一级都可以选
          value: 'cat_id',  //选中的值
          label: 'cat_name',  //看到的值
          children: 'children'  //选项的子选项为选项对象的某个属性值
        }
      }
    },
    methods: {
      // 请求商品分类列表数据
      async getCateList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
        if(res.meta.status !== 200){
          this.$message.error('获取商品分类数据失败')
        }
        this.catelist = res.data.result
        this.total = res.total
      },
      // 每页大小发生改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        //刷新列表
        this.getCateList()
      },
      // 当前页码发生改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //刷新列表
        this.getCateList()
      },
      // 显示添加分类对话框
      showaddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      // 获取父级分类列表数据
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if(res.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败！')
        }
        this.parentCateList = res.data
      },
      // 选择的选项发生改变
      parentCateChange() {
        //console.log(this.selectedKeys);
        //修改addCateForm的数据
        if(this.selectedKeys.length > 0) {     //大于一级
          //修改父级分类的id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
          //修改当前分类的等级
          this.addCateForm.cat_level = this.selectedKeys.length
          return   //进入if后面的代码不执行了
        } else {     //一级
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      // 关闭添加分类对话框，重置表单数据
      addCateDialogClose() {
        console.log(111);
        //重置第一项表单数据
        this.$refs.addCateFormRef.resetFields()
        //重置第二项表单数据(用v-model绑定的)
        this.selectedKeys = []
        //重置保存的选项
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      },
      // 确认按钮，添加新分类的网络请求
      addCate() {
        //console.log(this.addCateForm);
        //校验表单项
        this.$refs.addCateFormRef.validate(async valid => {
          //校验没通过
          if(!valid) return
          //校验通过，发起网络请求
          const {data: res} = await this.$http.post('categories', this.addCateForm)
          if(res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          //请求成功刷新列表
          this.getCateList()
        })
        this.addCateDialogVisible = false
      },
    },
    created() {
      // 获取商品分类列表数据
      this.getCateList()
    }
  }
</script>

<style scoped>
  .zk-table{
    margin-top: 15px;
  }
  .valid_icon{
    font-size: 16px
  }
  .el-cascader{
    width: 100%;
  }
</style>