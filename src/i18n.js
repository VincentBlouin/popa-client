import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import Vue from 'vue'
import Store from '@/store'
import i18next from 'i18next'
import VueI18Next from 'vue-i18next'

const i18n = {
  setup: function () {
    window.i18next = i18next
    Vue.use(VueI18Next)
    let savedLocale = Store.state.locale
    if (!savedLocale) {
      const localesArray = new I18nextBrowserLanguageDetector().detectors.navigator.lookup()
      const frIndex = localesArray.indexOf('fr')
      const enIndex = localesArray.indexOf('en')
      const isFrenchPreferredOverEnglish = frIndex !== -1 && frIndex < enIndex
      savedLocale = Store.state.locale = isFrenchPreferredOverEnglish ? 'fr' : 'en'
    }
    Store.state.locale = Vue.params.i18nextLanguage = savedLocale
    i18next.init({
      resources: {
        fr: {
          translation: {
            'search': 'Chercher',
            'required': 'Requis',
            'Name': 'Nom',
            'Description': 'Description',
            'Format': 'Format',
            'unitPrice': 'Prix unitaire',
            quantity: 'QTÉ',
            totalPrice: 'Prix total',
            rebate: 'Rabais',
            close: 'Fermer',
            notSubscribed: 'Pas inscris',
            subscribed: 'Inscris',
            details: 'détails',
            invalidEmail: 'courriel invalide',
            cancel: 'Annuler'
          }
        },
        en: {
          translation: {
            'search': 'Search',
            'required': 'Required',
            'Name': 'Name',
            'Description': 'Description',
            'Format': 'Format',
            'unitPrice': 'Unit price',
            quantity: 'QTY',
            totalPrice: 'Total price',
            rebate: 'Rebate',
            close: 'Close',
            notSubscribed: 'Not subscribed',
            subscribed: 'Subscribed',
            details: 'details',
            invalidEmail: 'invalid email',
            cancel: 'Cancel'
          }
        }
      }
    })
    Vue.filter('i18n', i18n.getText)
  },
  i18next: i18next,
  getText: function (value) {
    if (typeof value !== 'object' || !value) {
      return value
    }
    if (Object.keys(value).length <= 0) {
      return value
    }
    if (value[Store.state.locale]) {
      return value[Store.state.locale]
    }
    return value[Object.keys(value)[0]]
  },
  getLocale: function () {
    return Store.state.locale
  }
}
export default i18n
