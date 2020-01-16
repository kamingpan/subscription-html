import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/Index.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'home',
      path: '',
      component: Home,
      redirect: '/index'
    },
    {
      path: '',
      component: Home,
      children: [
        {
          name: 'index',
          path: '/index',
          component: () => import('@/views/index/Index')
        }
      ]
    }
  ]
})
