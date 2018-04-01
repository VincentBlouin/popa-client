import Vue from 'vue'

export default {
  setup: function () {
    Vue.filter('currency', function (value) {
      if (typeof value !== 'number') {
        return value
      }
      let formatter = new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2
      })
      return formatter.format(value)
    })
  }
}
