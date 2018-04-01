import i18n from '@/i18n'
import moment from 'moment'
import Vue from 'vue'

const locale = i18n.getLocale()
moment.locale(
  locale === 'fr'
    ? 'fr-ca' : 'en'
)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MMMM D YYYY, h:mm:ss')
  }
})
