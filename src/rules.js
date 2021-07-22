import I18n from '@/i18n'

export default {
  required: function (value) {
    return !!value || I18n.i18next.t('required')
  },
  email: function (value) {
    /* eslint-disable */
    if(!value){
      return true
    }
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || I18n.i18next.t('invalidEmail')
  },
  integer: function (value) {
    var x = parseFloat(value)
    return (!isNaN(value) && (x | 0) === x) || I18n.i18next.t('mustBeWholeNumber')
  }
}
