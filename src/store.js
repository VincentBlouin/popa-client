import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'
import DateUtil from '@/dateUtil'
import i18n from '@/i18n'

Vue.use(Vuex)
export default new Vuex.Store({
    strict: true,
    plugins: [
        VuexPersistedState()
    ],
    state: {
        token: null,
        user: null,
        isUserLoggedIn: false,
        baseComponent: 'Login',
        ardoiseUser: null
    },
    mutations: {
        setToken: function (state, token) {
            state.token = token
            if (token) {
                state.isUserLoggedIn = true
            } else {
                state.isUserLoggedIn = false
            }
        },
        setUser: function (state, user) {
            state.user = user
            state.baseComponent = getBaseComponentFromState(state)
        },
        setLocale: function (state, locale) {
            i18n.i18next.changeLanguage(locale);
            DateUtil.refreshLocale();
            if (state.locale === locale) {
                return
            }
            state.locale = locale;
        },
        setArdoiseUser: function (state, ardoiseUser) {
            state.ardoiseUser = ardoiseUser
        }
    },
    actions: {
        setToken: function (action, token) {
            action.commit('setToken', token)
        },
        setUser: function (action, user) {
            action.commit('setUser', user)
        },
        setLocale: function (action, locale) {
            action.commit('setLocale', locale)
        },
        setArdoiseUser: function (action, ardoiseUser) {
            action.commit('setArdoiseUser', ardoiseUser)
        }
    }
})

function getBaseComponentFromState(state) {
    if (!state.isUserLoggedIn) {
        return 'Login'
    }
    switch (state.user.status) {
        case 'ardoise':
            return 'ArdoiseLanding'
        case 'admin':
            return 'Subscribers'
        case 'subscribed':
            return 'AccountStatementPage'
    }
}
