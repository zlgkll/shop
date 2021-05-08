import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/home/Welcome'
import Users from '../components/home/users/Users'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载路由 导航守卫
// 登录页都可以访问，主页只有携带token信息才能访问，否则转到登录页
router.beforeEach((to, from, next) => {
  // next是函数，表示放行
  // 登录页都可以访问
  if(to.path === '/login') return next()
  // 非登录页
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')    // token为空
  next()  //token不为空放行
})

export default router
