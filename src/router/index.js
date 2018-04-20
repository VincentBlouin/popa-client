import Vue from 'vue'
import Router from 'vue-router'
import AccountStatementPage from '@/components/AccountStatementPage'
import Login from '@/components/Login'
import Subscribers from '@/components/Subscribers'
import Subscriber from '@/components/Subscriber'
import Products from '@/components/Products'
import Product from '@/components/Product'
import ArdoiseLanding from '@/components/ArdoiseLanding'
import Subscribe from '@/components/Subscribe'
import ArdoiseTransaction from '@/components/ArdoiseTransaction'
import TransactionItems from '@/components/TransactionItems'
import SendChangePasswordEmail from '@/components/SendChangePasswordEmail'
import ChangePassword from '@/components/ChangePassword'
import ClientTransaction from '@/components/ClientTransaction'

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
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    },
    {
      path: '/product/:productId',
      name: 'ChangeProduct',
      component: Product
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
      name: 'ArdoiseTransaction',
      component: ArdoiseTransaction
    },
    {
      path: '/transactions-items',
      name: 'TransactionItems',
      component: TransactionItems
    },
    {
      path: '/send-change-password-email',
      name: 'SendChangePasswordEmail',
      component: SendChangePasswordEmail
    },
    {
      path: '/change-password/:token',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/client-transaction',
      name: 'ClientTransaction',
      component: ClientTransaction
    },
    {
      path: '/account-statement',
      name: 'AccountStatementPage',
      component: AccountStatementPage
    }
  ]
})
