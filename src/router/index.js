import Vue from 'vue'
import Router from 'vue-router'
// import Account from '@/components/Account'
import Login from '@/components/Login'
import Subscribers from '@/components/Subscribers'
import Subscriber from '@/components/Subscriber'
import ArdoiseLanding from '@/components/ArdoiseLanding'
import Subscribe from '@/components/Subscribe'
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
      path: '/subscriber',
      name: 'Subscriber',
      component: Subscriber
    },
    {
      path: '/subscriber/:subscriberId',
      name: 'ChangeSubscriber',
      component: Subscriber
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
