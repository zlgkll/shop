<template>
  <div>
    <!-- 面包屑导航 -->
    <template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 查询添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <template>
        <el-table :data="userList" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="身份"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!-- {{scope.row}} 可以拿到一行的数据 -->
              <el-switch v-model="scope.row.mg_state" @change="UserstateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="175px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdictDialog(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="设置身份" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页区域 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="edictDialogVisible" width="50%" @close="edictDialogClose">
      <el-form :model="edictForm" :rules="edictFormRules" ref="edictFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edictForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edictForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="edictForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="edictDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edictUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      // 自定义校验规则(手机号、邮箱)
      var checkEmail = (rule, value, cb) => {
        const regemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if(regemail.test(value)){
          return cb()
        }
        cb(new Error('请输入合法邮箱'))
      }
      var checkMobile = (rule, value, cb) => {
        const regmobile = /^[1][3,4,5,7,8][0-9]{9}$/
        if(regmobile.test(value)){
          return cb()
        }
        cb(new Error('请输入合法手机号'))
      }
      // 数据
      return {
        // 请求参数
        queryInfo: {
          query: '',
          // 当前页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2
        },
        //用户列表数据
        userList: [],
        // 用户列表一共多少条数据
        total: 0,
        // 添加用户对话框显示隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加用户表单的验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '请输入长度在3~10个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '请输入长度在6~15个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
              //自定义校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
        // 修改用户信息对话框显示隐藏
        edictDialogVisible: false,
        // 修改用户信息的表单数据
        edictForm: {},
        // 修改用户信息表单的验证规则
        edictFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '请输入长度在3~10个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            //自定义校验规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      // 获取用户列表数据
      async getUserList() {
        const res = await this.$http.get('users', {params: this.queryInfo})
        //console.log(res);
        if (res.status !== 200)
          return this.$message.error('获取用户列表失败')
        this.userList = res.data.data.users
        this.total = res.data.data.total
      },
      // 监听开关修改用户状态
      async UserstateChange(userinfo){
        //发送修改请求
        const res = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        //请求失败，开关取反变回原样
        if(res.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        //请求成功
        return this.$message.success('更新用户状态成功')
      },
      // 改变分页尺寸
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        this.getUserList()
      },
      // 当前所在页数
      handleCurrentChange(curpage) {
        this.queryInfo.pagenum = curpage
        this.getUserList()
      },
      // 关闭添加用户对话框（重置表单）
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加新用户
      addUser() {
        //添加用户前表单的预校验
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return
          //校验成功，发起网络请求
          const res = await this.$http.post('users', this.addForm)
          if (res.status !== 200)
            this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          //成功关闭对话框，并刷新用户列表
          this.addDialogVisible = false
          this.getUserList()
        })
      },
      // 打开修改用户对话框，实现数据自动填充
      async showEdictDialog(id) {
        //查询用户信息网络请求，成功就弹出对话框
        const res = await this.$http.get('users/'+id)
        if (res.status !== 200)
          return this.$message.error('查询用户信息失败')
        this.edictForm = res.data.data
        this.edictDialogVisible = true
      },
      // 关闭修改用户对话框（重置表单）
      edictDialogClose() {
        this.$refs.edictFormRef.resetFields()
      },
      // 编辑用户信息
      edictUser() {
        //预验证
        this.$refs.edictFormRef.validate(async valid => {
          if(!valid) return
          //校验成功，发起网络请求
          const res = await this.$http.put('users/',
              this.edictForm.id, {email:this.edictForm.email, mobile:this.edictForm.mobile})
          if (res.status !== 200)
            this.$message.error('修改用户信息失败')
          this.$message.success('修改用户信息成功')
          //成功关闭对话框，并刷新用户列表
          this.edictDialogVisible = false
          this.getUserList()
        })
      },
      // 删除用户操作
      async deleteUser(id) {
        //弹出弹框
        const confirmres = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //promise成功返回字符串"confirm"失败返回字符串"cancel"
        if(confirmres === 'confirm') {
          const res = await this.$http.delete('users/'+id)
          if(res.status !== 200)
            this.$message.error('删除用户失败')
          this.$message.success('删除用户成功')
          this.getUserList()
        }
      }
    },
    created() {
      // 获取用户列表数据
      this.getUserList()
    }
  }
</script>

<style scoped>
  .el-table{
    margin-top: 15px;
    font-size: 13px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>