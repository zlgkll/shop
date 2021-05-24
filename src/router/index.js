import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')

// import Users from './components/user/Users.vue'
const Users = () => import( '../components/user/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// import Order from './components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

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
