<template>
  <div>
    主页
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      // 退出登录
      logout(){
        // 清空sessionstorage
        window.sessionStorage.clear()
        // 跳转
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>

</style>