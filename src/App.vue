<template>
  <div id="app">
    <v-app>
      <v-app-bar
          app
          color="primary"
          dark
      >
        <!--        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
        <!--      <v-toolbar-->
        <!--          app-->
        <!--          dark-->
        <!--          color="primary"-->
        <!--          :clipped-left="clipped"-->
        <!--      >-->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isUserOtherThanArdoise"></v-app-bar-nav-icon>
        <!--<v-btn icon @click.stop="miniVariant = !miniVariant">-->
        <!--<v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>-->
        <!--</v-btn>-->
        <!--<v-btn icon @click.stop="clipped = !clipped">-->
        <!--<v-icon>web</v-icon>-->
        <!--</v-btn>-->
        <!--<v-btn icon @click.stop="fixed = !fixed">-->
        <!--<v-icon>remove</v-icon>-->
        <!--</v-btn>-->
        <!--<a href="#" class="no-style-link">-->
        <!--<img :src=  "require('@/assets/image.png')" class="mr-2" height="38px;" style="vertical-align: middle">-->
        <!--</a>-->
        <v-toolbar-title dark>
          {{ $t('header:title') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="rightDrawer = !rightDrawer" v-if="isUserOtherThanArdoise">
          <v-icon>settings</v-icon>
        </v-btn>
        <v-btn text v-if="!$store.state.isUserLoggedIn || !isUserOtherThanArdoise" @click="switchLanguage()">
          <v-icon class="mr-2">public</v-icon>
          <span v-if="$store.state.locale === 'fr'">
            English
          </span>
          <span v-if="$store.state.locale === 'en'">
            Français
          </span>
        </v-btn>
        <v-navigation-drawer
            app
            temporary
            :right="right"
            v-model="rightDrawer"
            fixed
            light
            absolute
            bottom
        >
          <v-list>
            <v-list-item @click="switchLanguage()">
              <v-list-item-action>
                <v-icon>public</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-if="$store.state.locale === 'fr'">
                  English
                </v-list-item-title>
                <v-list-item-title v-if="$store.state.locale === 'en'">
                  Français
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logout()" v-if="isUserOtherThanArdoise">
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('header:logout') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-app-bar>
      <v-navigation-drawer
          v-if="isUserOtherThanArdoise"
          :mini-variant="miniVariant"
          :clipped="clipped"
          v-model="drawer"
          light
          app
          fixed
      >
        <v-list>
          <v-list-item
              value="true"
              v-for="(item, i) in menuItems"
              :key="i"
              @click="goTo(item.path)"
          >
            <v-list-item-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(item.title) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <router-view/>
      </v-content>
      <v-footer :fixed="fixed" app>
        <span></span>
      </v-footer>
      <v-snackbar
          color="error"
          multi-line
          :timeout="10000"
          vertical
          v-model="showRequestErrorMessage"
      >
        {{ $t('header:requestError') }}
        <v-btn left text @click.native="showRequestErrorMessage = false">
          {{ $t('close') }}
        </v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
import i18n from '@/i18n'
import RequestErrors from '@/requestError'

const loggedOutOnlyPages = ['Login', 'Register', 'ForgotPassword', 'ChangePassword', 'SendChangePasswordEmail']
export default {
  data() {
    i18n.i18next.addResources('en', 'header', {
      title: 'Self service basket Potagers Partagés',
      logout: 'Logout',
      requestError: 'There\'s a connection problem with our server. Try again later.',
      subscriber: 'Subscribers',
      products: 'Products',
      transactions: 'Transactions',
      accountStatement: 'Account statement',
      transaction: 'Transaction'
    })
    i18n.i18next.addResources('fr', 'header', {
      title: 'Panier libre service Potagers Partagés',
      logout: 'Déconnexion',
      requestError: 'Il y a un problème de connexion avec notre serveur. Essayez de nouveau plus tard.',
      subscriber: 'Abonnés',
      products: 'Produits',
      transactions: 'Transactions',
      accountStatement: 'Relevé de compte',
      transaction: 'Transaction'
    })
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'people',
        title: 'header:subscriber',
        path: '/subscribers'
      }, {
        icon: 'local_florist',
        title: 'header:products',
        path: '/products'
      }, {
        icon: 'assignment',
        title: 'header:transactions',
        path: '/transactions-items'
      }],
      subscriberItems: [{
        icon: 'assignment',
        title: 'header:accountStatement',
        path: '/account-statement'
      }, {
        icon: 'shopping_basket',
        title: 'header:transaction',
        path: '/client-transaction'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      showRequestErrorMessage: false,
      requestErrors: RequestErrors.requestErrors
    }
  },
  name: 'App',
  methods: {
    switchLanguage: function () {
      const newLocale = this.$store.state.locale === 'en' ? 'fr' : 'en'
      this.$store.dispatch('setLocale', newLocale)
    },
    logout: function () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      window.location.href = '/login'
    },
    redirectToBasePage: function () {
      if (window.location.pathname !== '/') {
        return
      }
      this.$router.push({
        name: this.$store.state.baseComponent
      })
    },
    redirectIfOnWrongPage: function () {
      const isOnLoggedOutOnlyPage = loggedOutOnlyPages.indexOf(this.$route.name) !== -1
      const isLoggedInAndOnWrongPage = this.$store.state.isUserLoggedIn && isOnLoggedOutOnlyPage
      const isLoggedOutAndOnWrongPage = !this.$store.state.isUserLoggedIn && !isOnLoggedOutOnlyPage
      if (isLoggedInAndOnWrongPage || isLoggedOutAndOnWrongPage) {
        this.$router.push({
          name: this.$store.state.baseComponent
        })
      }
    },
    goTo: function (path) {
      this.$router.push({
        path: path
      })
    }
  },
  mounted: function () {
    this.redirectToBasePage()
    this.redirectIfOnWrongPage()
  },
  beforeUpdate: function () {
    this.redirectIfOnWrongPage()
  },
  computed: {
    isUserOtherThanArdoise: function () {
      return this.$store.state.isUserLoggedIn && this.$store.state.user.status !== 'ardoise'
    },
    menuItems: function () {
      return this.$store.state.user.status === 'admin' ? this.items : this.subscriberItems
    }
  },
  watch: {
    requestErrors: function () {
      this.showRequestErrorMessage = true
    }
  }
}
</script>
<style>
.vh-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
