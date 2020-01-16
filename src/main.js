import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'font-awesome/css/font-awesome.min.css' // font-awesome

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
