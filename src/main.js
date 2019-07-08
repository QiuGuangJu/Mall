// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
import store from './store'

Vue.use(VueInfiniteScroll)

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  loading: '../static/loading-svg/loading-balls.svg'
})



Vue.config.productionTip = false

import './assets/css/base.css'
import './assets/css/login.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
})
