import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import fr from 'vuetify/lib/locale/fr'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  theme: {
    dark: false,
    lang: {
      locales: {fr},
      current: 'fr'
    },
    themes: {
      light: {
        primary: '#E65100',
        secondary: '#0086e6',
        accent: '#1B5E20',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
      dark: {
        primary: '#E65100',
        secondary: '#0086e6',
        accent: '#1B5E20',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  }
})
