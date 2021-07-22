// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import I18n from '@/i18n'
import App from './App'
import vuetify from './plugins/vuetify'
import router from './router'
import store from '@/store'
import Panel from '@/components/Panel'
import DateUtil from '@/dateUtil'
import CurrencyFilter from '@/currencyFilter'
import IdleVue from 'idle-vue'

const vueI18nExt = I18n.setup();

Vue.config.productionTip = false

DateUtil.setup()
CurrencyFilter.setup()
Vue.component('panel', Panel)
const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 2 * 60 * 1000
})

new Vue({
  i18n: vueI18nExt,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
