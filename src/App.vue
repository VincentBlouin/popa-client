<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      v-if="$store.state.isUserLoggedIn && $store.state.user.status !== 'ardoise'"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click="goTo(item.path)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{$t(item.title)}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      color="primary"
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"
                           v-if="$store.state.isUserLoggedIn && $store.state.user.status != 'ardoise'"></v-toolbar-side-icon>
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
        {{$t('header:title')}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >

      <v-list>
        <v-list-tile @click="switchLanguage()">
          <v-list-tile-action>
            <v-icon>public</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="$store.state.locale === 'fr'">
              English
            </v-list-tile-title>
            <v-list-tile-title v-if="$store.state.locale === 'en'">
              Français
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()" v-if="$store.state.user && $store.state.user.status !== 'ardoise'">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{$t('header:logout')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span></span>
    </v-footer>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n'

  const loggedOutOnlyPages = ['Login', 'Register', 'ForgotPassword', 'ChangePassword']
  export default {
    data () {
      i18n.i18next.addResources('en', 'header', {
        title: 'Self service basket Potagers Partagés',
        logout: 'Logout',
        requestError: 'There\'s a connection problem with our server. Try again later.',
        subscriber: 'Subscribers',
        products: 'Products'
      })
      i18n.i18next.addResources('fr', 'header', {
        title: 'Panier libre service Potagers Partagés',
        logout: 'Déconnexion',
        requestError: 'Il y a un problème de connexion avec notre serveur. Essayez de nouveau plus tard.',
        subscriber: 'Abonnés',
        products: 'Produits'
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
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false
      }
    },
    name: 'App',
    methods: {
      switchLanguage: function () {
        const newLocale = Vue.params.i18nextLanguage === 'en' ? 'fr' : 'en'
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
    }
  }
</script>
