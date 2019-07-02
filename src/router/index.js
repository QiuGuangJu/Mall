import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import cart from '@/views/Cart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    }
  ]
})
