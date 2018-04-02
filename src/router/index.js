import Vue from 'vue'
import Router from 'vue-router'
// import Account from '@/components/Account'
import Login from '@/components/Login'
import Subscribers from '@/components/Subscribers'
import ArdoiseLanding from '@/components/ArdoiseLanding'
import Subscribe from '@/components/Subscribe'
import AnonymousTransaction from '@/components/AnonymousTransaction'
import Transaction from '@/components/Transaction'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/subscribers',
      name: 'Subscribers',
      component: Subscribers
    },
    {
      path: '/ardoises',
      name: 'ArdoiseLanding',
      component: ArdoiseLanding
    },
    {
      path: '/subscribe',
      name: 'Subscribe',
      component: Subscribe
    },
    {
      path: '/anonymous-transaction',
      name: 'AnonymousTransaction',
      component: AnonymousTransaction
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: Transaction
    }
    // {
    //   path: '/',
    //   name: 'Account',
    //   component: Account
    // }
  ]
})
