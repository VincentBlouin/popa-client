// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from '@/i18n'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VTextField,
  VForm,
  VDataTable,
  VCard,
  VAlert,
  VSubheader,
  VSnackbar,
  VDivider,
  VAvatar,
  VDialog
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import VueParams from 'vue-params'
import Store from '@/store'
import Panel from '@/components/Panel'
import DateFilter from '@/dateFilter'
import CurrencyFilter from '@/currencyFilter'

Vue.component('panel', Panel)

Vue.use(VueParams)

DateFilter.setup()
CurrencyFilter.setup()
i18n.setup()
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VTextField,
    VForm,
    VDataTable,
    VCard,
    VAlert,
    VSubheader,
    VSnackbar,
    VDivider,
    VAvatar,
    VDialog
  },
  theme: {
    primary: '#E65100',
    secondary: '#0086e6',
    accent: '#1B5E20',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: Store,
  components: {App},
  template: '<App/>'
})
