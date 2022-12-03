import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/mock/mockServer'
import store from './store'
import ElementUI from 'element-ui';
import * as API from '@/api'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.less'

Vue.prototype.$echarts = window.echarts

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate(){
    Vue.prototype.$API = API
  },
  render: h => h(App)
}).$mount('#app')
