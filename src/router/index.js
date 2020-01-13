import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import login from '../views/login'
import reg from '../views/reg'
import attuserlist from '../components/me/attuserlist'
import Vuex from 'vuex'
// import comment from '../components/index/comment'
import upto from '../views/upto'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta:1,
    component: Home,
  },
  {
    path:'/login',
    meta:2,
    component:login
  },
  {
    path:'/reg',
    meta:3,
    component:reg
  },
  {
    path:'/attuserlist',
    name:'attuserlist',
    meta:4,
    component:attuserlist
  },
  {
    path:'/upto',
    name:'upto',
    meta:5,
    component:upto
  }
]

const router = new VueRouter({
  routes
})

export default router
