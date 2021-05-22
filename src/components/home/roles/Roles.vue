<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <!-- 角色列表 -->
      <template>
        <el-table :data="rolesList" border style="width: 100%">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                      :class="['bdbottom', i1 === 0 ? 'bdtop':'', 'vcenter']">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="tagClose(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级、三级权限 -->
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                          :class="[i2 === 0 ? '':'bdtop', 'vcenter']">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="tagClose(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                              closable @close="tagClose(scope.row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="rolesList" ref="addFormRef" label-width="70px">
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
      <!-- 权限树形结构 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id"
               :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        // 角色列表
        rolesList: [],
        // 对话框
        addDialogVisible: false,
        setRightDialogVisible: false,
        // 权限列表
        rightList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          //看到的值
          label:'authName',
          //通过哪个属性嵌套
          children:'children',
        },
        // 树形结构默认勾选的节点Id
        defKeys: [],
        // 即将分配权限的角色id
        roleId: ''
      }
    },
    methods: {
      // 获取角色列表数据
      async getRolesList() {
        const res = await this.$http.get('roles')
        if(res.data.meta.status !== 200)
          return this.$message.error('无法获取角色列表')
        //保存数据
        this.rolesList = res.data.data
        console.log(this.rolesList);
      },
      // 添加新角色
      addRole() {
        this.addDialogVisible = true
      },
      addDialogClose() {
        // this.$refs.addFormRef.resetFields()
      },
      // 编辑角色
      editRole() {
        this.$message.warning('要编辑')
      },
      // 删除角色
      deleteRole() {
        this.$message.warning('要删啦')
      },
      // 删除权限标签
      async tagClose(role, rightid) {
        //MessageBox弹框
        const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirm !== 'confirm')
          return this.$message.info('取消了删除！')
        // 发送网络请求，删除权限
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        if(res.meta.status !== 200)
          return this.$message.error('删除权限失败')
        //网络请求返回更新的权限列表，直接改部分数据，不要重新渲染
        // this.getRolesList()
        role.children = res.data
      },
      // 分配权限点击事件
      async showSetRightDialog(role) {
        //保存角色id
        this.roleId = role.id
        //发送网络请求请求权限数据
        const {data: res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200) {
          return this.$message.error('获取权限失败')
        }
        this.rightList = res.data
        // 默认勾选项
        this.defKeys = []
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true
      },
      // 获取角色下的三级权限id值，并保存到数组中（递归）
      getLeafKeys(node, arr) {
        //console.log(node);
        if(!node.children) {
          arr.push(node.id)
          return arr
        }
        node.children.forEach(item =>
            this.getLeafKeys(item, arr)
        )

      },
      // 分配权限网络请求
      async allotRights() {
        //获取选中的节点id
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
        if(res.meta.status !== 200){
          return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        //刷新列表
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    },
    // 生命周期钩子
    created() {
      this.getRolesList()
    },
  }
</script>

<style scoped>

  .el-tag {
    margin: 7px;
  }
  /* 边框线 */
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  /* 纵向居中对齐 */
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>