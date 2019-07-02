<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="priceSort">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" :class="{'filterby-show':filterBy}" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="priceCheckAll" :class="{'cur':priceChecked==='all'}">All</a>
              </dd>
              <dd v-for="(item, index) of priceFilter" :key="index">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked===index}">{{item.priceStart}}
                  - {{item.priceEnd}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/' + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- 滚动加载-->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                <img v-show="showLoading" src="../../static/loading-svg/loading-spinning-bubbles.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!-- Modal not login in -->
    <modal v-show="mdShow" @hidden="handleHidden">
      <span slot="md-title">提示</span>
      <p slot="msg" v-show="!addCartSucc">请先登录！</p>
      <p slot="msg" v-show="addCartSucc">加入购物车成功</p>
      <div slot="btnGroup">
        <button class="btn btn--m" v-show="!addCartSucc" @click="handleHidden">关闭</button>
        <button class="btn btn--m" v-show="addCartSucc" @click="handleHidden">继续添加</button>
        <button class="btn btn--m" v-show="addCartSucc" @click="showCart">查看购物车</button>
      </div>
    </modal>
    <!-- Modal addCart success -->
    <!--<modal v-show="addCartSucc" @hidden="handleHidden">
      <span slot="md-title">提示</span>
      <p slot="msg">加入购物车成功</p>
      <div slot="btnGroup">
        <button class="btn btn&#45;&#45;m" @click="handleHidden">继续添加</button>
        <button class="btn btn&#45;&#45;m" @click="showCart">查看购物车</button>
      </div>
    </modal>-->
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import "./../assets/css/base.css"
  import "./../assets/css/product.css"
  import NavHeader from '@/components/Header'
  import NavFooter from '@/components/Footer'
  import NavBread from '@/components/Bread'
  import Modal from '@/components/Modal'
  import Axios from 'axios'

  export default {
    data() {
      return {
        mdShow: false,
        addCartSucc: false,
        goodsList: [],
        showLoading: false,
        priceChecked: 'all',
        priceFilter: [{
          priceStart: 100.00,
          priceEnd: 500.00
        }, {
          priceStart: 500.00,
          priceEnd: 1000.00
        }, {
          priceStart: 1000.00,
          priceEnd: 2000.00
        }, {
          priceStart: 2000.00,
          priceEnd: 5000.00
        }, {
          priceStart: 5000.00,
          priceEnd: 10000.00
        },],
        filterBy: false,
        overLayFlag: false,
        busy: true,
        page: 1,
        pageSize: 8,
        sort: true,
        cover: false,
        increment: true,
        priceLevel: 'all',
      }
    },
    computed: {
      params() {
        return {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sort ? 1 : -1,
          priceLevel: this.priceLevel
        }
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    methods: {
      showCart(){
        console.log('进入购物车!')
      },
      handleHidden(){
        this.mdShow = false
        this.addCartSucc = false
      },
      showFilterPop() {
        this.filterBy = true
        this.overLayFlag = true
      },
      setPriceFilter(index) {
        this.priceChecked = index
        this.closePop()
        this.priceCheck(index)
      },
      closePop() {
        this.filterBy = false
        this.overLayFlag = false
      },
      loadMore: function () {
        this.showLoading = true
        this.busy = true;
        setTimeout(() => {
          this.page++
          this.getGoodsList(false)

        }, 500);
      },
      priceSort() {
        this.goodsList.sort((pre, next) => {
          if (this.increment) {
            return next.salePrice - pre.salePrice
          } else {
            return pre.salePrice - next.salePrice
          }
        })
        this.increment = !this.increment
      },
      getGoodsList(cover) {
        Axios.get('/goods', {
          params: this.params
        }).then((res) => {
          let _res = res.data
          if (_res.status === '0') {
            if (!cover) {
              this.goodsList = this.goodsList.concat(_res.result.list)
            } else {
              this.goodsList = _res.result.list
            }
          } else {
            this.goodsList = []
          }
          if (_res.result.list.length < 8) {
            this.busy = true
          } else {
            this.busy = false
          }
          this.showLoading = false
        })
      },
      priceCheck(index) {
        this.priceLevel = index
        this.page = 1
        this.getGoodsList(true)
      },
      priceCheckAll() {
        this.priceChecked = 'all'
        this.priceLevel = 'all'
        this.getGoodsList(true)
      },
      addCart(productId) {
        Axios.post("/goods/addCart", {
          productId: productId
        }).then(res => {
          if (res.status === 200) {
            if (res.data.status === 0) {
              this.mdShow = true
              this.addCartSucc = true
            } else {
              this.mdShow = true
              this.addCartSucc = false
            }
          }
        })
      }
    },
    mounted() {
      this.getGoodsList(true)
    }
  }
</script>

<style lang="stylus" scoped>
</style>
