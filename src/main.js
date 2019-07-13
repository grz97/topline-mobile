import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 设置验证提示信息为中文
import VeeValidate, {
  Validator
} from 'vee-validate' // 表单验证插件

Vue.use(VeeValidate, {
  // 配置改变的时候去触发 默认是input
  events: ''
})
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)

Vue.config.productionTip = false
// 数据加载完毕 使用定时器缓存请求
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
