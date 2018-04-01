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
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
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
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="$store.state.isUserLoggedIn && $store.state.user.status != 'ardoise'"></v-toolbar-side-icon>
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
      <v-toolbar-title v-text="title" dark></v-toolbar-title>
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
            <v-list-tile-title>
              {{switchLanguageText}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()">
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

  export default {
    data () {
      i18n.i18next.addResources('en', 'header', {
        title: 'Self service basket Potagers Partagés',
        logout: 'Logout',
        requestError: 'There\'s a connection problem with our server. Try again later.',
        subscriber: 'Subscribers'
      })
      i18n.i18next.addResources('fr', 'header', {
        title: 'Panier libre service Potagers Partagés',
        logout: 'Déconnexion',
        requestError: 'Il y a un problème de connexion avec notre serveur. Essayez de nouveau plus tard.',
        subscriber: 'Abonnés'
      })
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'people',
          title: Vue.t('header:subscriber'),
          path: '/credit-sessions'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: Vue.t('header:title'),
        switchLanguageText: this.getLanguageSwitcherText()
      }
    },
    name: 'App',
    methods: {
      getLanguageSwitcherText: function () {
        switch (Vue.params.i18nextLanguage) {
          case 'fr':
            return 'English'
          case 'en':
            return 'Français'
        }
      },
      switchLanguage: function () {
        const newLocale = Vue.params.i18nextLanguage === 'en' ? 'fr' : 'en'
        this.$store.dispatch('setLocale', newLocale)
        // if (this.$store.state.isUserLoggedIn) {
        //   UserService.changeLocale(
        //     this.$store.state.user,
        //     newLocale
        //   )
        // }
        this.switchLanguageText = this.getLanguageSwitcherText()
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
      }
    },
    mounted: function () {
      this.redirectToBasePage()
    }
  }
</script>
