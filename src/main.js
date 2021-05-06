import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'


/* 导入全局样式表 */
import './assets/css/global.css'
/* 导入字体图标 */
import './assets/fonts/iconfont.css'
/* 导入axios */
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://106.53.73.30:8888/api/private/v1/'
// 把axios挂载在vue原型对象上
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
