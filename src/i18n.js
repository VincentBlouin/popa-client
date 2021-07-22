import Vue from 'vue'
import Store from '@/store'
import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

const i18n = {
    setup: function () {
        Vue.use(VueI18Next);
        let savedLocale = Store.state.locale;
        if (!savedLocale) {
            let localesArray = new I18nextBrowserLanguageDetector().detectors.navigator.lookup();
            let frIndex = localesArray.indexOf("fr");
            let enIndex = localesArray.indexOf("en");
            let isFrenchPreferredOverEnglish = frIndex !== -1 && frIndex < enIndex;
            savedLocale = Store.state.locale = isFrenchPreferredOverEnglish ? "fr" : "en";
        }
        String.prototype.noAccents = function () {
            var accent = [
                /[\300-\306]/g, /[\340-\346]/g, // A, a
                /[\310-\313]/g, /[\350-\353]/g, // E, e
                /[\314-\317]/g, /[\354-\357]/g, // I, i
                /[\322-\330]/g, /[\362-\370]/g, // O, o
                /[\331-\334]/g, /[\371-\374]/g, // U, u
                /[\321]/g, /[\361]/g, // N, n
                /[\307]/g, /[\347]/g, // C, c
            ];
            var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

            var str = this;
            for (var i = 0; i < accent.length; i++) {
                str = str.replace(accent[i], noaccent[i]);
            }

            return str;
        }
        i18next.init({
            lng: savedLocale,
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
                        cancel: 'Annuler',
                        finish: 'Terminer'
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
                        cancel: 'Cancel',
                        finish: 'Finish'
                    }
                }
            }
        })
        Store.dispatch('setLocale', savedLocale);
        Vue.filter('i18n', i18n.getText)
        return new VueI18Next(i18next);
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
