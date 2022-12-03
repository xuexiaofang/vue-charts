import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from  '@/views/TrendPage'

Vue.use(VueRouter)

const routes = [
  {
    path:'/sellerPage',
    component:SellerPage
  },
  {
    path:'/trendPage',
    component:TrendPage
  },{
    path:'/',
    redirect:'/trendPage'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
