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
// 注册一个全局过滤器来处理日期格式的展示
// 过滤器就是一个函数，我们可以在模板中通过 {{ 数据 | 过滤器 }} 来调用这个过滤器函数
// 过滤器函数接收的参数就是你的数据，返回值就会绑定输出到使用的位置
// {{ 数据 | relativeTime }}
// 好处：任何组件的模板都可以通过 {{ 数据 | 过滤器 }} 来使用这里定义的过滤器
// 说白了就是一个全局函数
Vue.filter('relativeTime', value => {
  return dayjs().from(value)
})

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
