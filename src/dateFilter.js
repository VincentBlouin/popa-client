import i18n from '@/i18n'
import moment from 'moment'
import Vue from 'vue'

const dateFilter = {
  setup: function () {
    Vue.filter('date', function (value) {
      if (value) {
        return moment(String(value)).format('D MMMM YYYY, HH:mm:ss')
      }
    })
    Vue.filter('dayDate', function (value) {
      if (value) {
        return moment(String(value)).format('D MMMM YYYY')
      }
    })
    dateFilter.refreshLocale()
  },
  refreshLocale: function () {
    moment.locale(
      i18n.getLocale() === 'fr'
        ? 'fr-ca' : 'en'
    )
  }
}

export default dateFilter
