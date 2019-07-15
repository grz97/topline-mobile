import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 设置验证提示信息为中文
import VeeValidate, {
  Validator
} from 'vee-validate' // 表单验证插件
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 加载中文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // dayjs 的相对时间插件
dayjs.extend(relativeTime) // 把插件注册到dayjs中
dayjs.locale('zh-cn') // 配置使用中文语言包
Vue.use(VeeValidate, {
  // 配置改变的时候去触发 默认是input
  events: ''
})
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
// 使用图片懒加载
Vue.use(Lazyload)

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
