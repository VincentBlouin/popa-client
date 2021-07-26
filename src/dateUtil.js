import i18n from '@/i18n'
import moment from 'moment'
import Vue from 'vue'

const dateUtil = {
    setup: function () {
        Vue.filter('date', function (value) {
            if (value) {
                return moment(String(value)).format('D MMMM YYYY, HH:mm:ss')
            }
        })
        Vue.filter('dayDate', dateUtil.getDayDate)
        dateUtil.refreshLocale()
    },
    refreshLocale: function () {
        moment.locale(
            i18n.getLocale() === 'fr'
                ? 'fr-ca' : 'en'
        )
    },
    getDayDate: function (value) {
        if (value) {
            return moment(String(value)).format('D MMMM YYYY')
        }
    },
    areDatesSameDay: function (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    }
}

export default dateUtil
