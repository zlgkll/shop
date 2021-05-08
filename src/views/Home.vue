<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div class="iconcont">
        <img src="../assets/img/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 内容主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#609EFD"
                 unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu v-for="(item, index) in menulist" :key="item.id" :index="item.id+''">
            <!-- 一级菜单模板 -->
            <template #title>
              <i :class="'iconfont icon-'+menuicon[index]" class="menu-icon"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="'/'+subitem.path"
                          @click="saveNavState('/'+subitem.path)">
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        //菜单
        menulist: [],
        //菜单图标
        menuicon: ['duoren2', 'quanxian', 'shangpin', 'dingdan', 'baobiao'],
        //侧边栏折叠展开
        isCollapse: false,
        //当前活跃的路由
        activePath: ''
      }
    },
    methods: {
      // 退出登录
      logout(){
        // 清空sessionstorage
        window.sessionStorage.clear()
        // 跳转
        this.$router.push('/')
      },
      // 获取所有菜单数据
      async getMenuList() {
        const {data: res} = await this.$http.get('menus')
        //console.log(res);
        if(res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.menulist = res.data
        console.log(this.menulist);
      },
      // 点击按钮，菜单栏折叠、展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      // 保存路由的激活状态（当前链接地址）
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    },
    created() {
      // 获取菜单
      this.getMenuList()
      // 保存路由激活状态
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    color: #f0f0f0;
  }
  .el-header .iconcont{
    display: flex;
    align-items: center;
  }
  .el-header .iconcont span{
    margin-left: 9px;
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .menu-icon{
    margin-right: 8px;
  }
  .el-menu{
    /*默认有边框*/
    border: none;
  }
  .toggle-button{
    height: 23px;
    line-height: 23px;
    font-size: 10px;
    background-color: #4d5162;
    color: #f0f0f0;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>