<template>
  <div class="login_cont">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/img/angel.png" alt="">
      </div>
      <!--登陆表单-->
      <el-form :model="loginform" :rules="rules" ref="loginformRef" label-width="55px" class="login_form">
        <el-form-item label="账  户" prop="username">
          <el-input v-model="loginform.username" prefix-icon="iconfont icon-denglu1"></el-input>
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input v-model="loginform.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <div class="btns">
          <el-button @click="login" type="primary" round>登&nbsp;&nbsp;&nbsp;录</el-button>
          <el-button @click="resetLoginForm" type="info" round>重&nbsp;&nbsp;&nbsp;置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        // 登录信息
        loginform: {
          username: '',
          password: null
        },
        // 登录验证规则
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入正确密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 重置
      resetLoginForm(){
        console.log(this)
        this.$refs.loginformRef.resetFields();
      },
      // 登陆前预验证
      login() {
        this.$refs.loginformRef.validate(async valid => {
          console.log(valid)   // 打印验证布尔值
          // 验证登录信息填写格式
          if(!valid) return
          // 服务器请求
          const {data: res} = await this.$http.post('login', this.loginform)
          console.log(res)
          if(res.meta.status !== 200) return this.$message.error('登陆失败')  // 登陆失败message弹窗
          console.log("登陆成功")
          // 登陆成功后的token，保存到 sessionstorage 中
          window.sessionStorage.setItem("token", res.data.token)
          // 路由跳转
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style scoped>
  .login_cont{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 2px solid #b7b7b7;
    padding: 4px;
    box-shadow: 2px 2px 7px #a5a5a5;
    margin: auto;
    margin-top: -66px;
  }
  .avatar_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ffffffb8;
  }
  .login_form{
    padding: 0 20px;
    margin-top: 30px;
  }
  .el-form-item input{
    margin-left: 55px;
  }
  .btns{
    display: flex;
    justify-content: center;
  }
</style>