<template>
  <panel :title="$t('landing:title')">
    <v-card flat>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex>
            <v-card>
              <v-card-title>
                <div class="headline">
                  {{$t('landing:subscribed')}}
                </div>
              </v-card-title>
              <v-card-text>
                <v-alert v-if="error !== null" icon="warning" :value="true" color="error">
                  {{$t('landing:wrongLogin')}}
                </v-alert>
                <div ref="form">
                  <v-text-field
                    name="ardoiseIdentifier"
                    :label="$t('landing:ardoiseIdentifier')"
                    type="password"
                    :rules="[rules.required]"
                    v-model="ardoiseIdentifier"
                  ></v-text-field>
                  <v-btn
                    @click="ardoiseLogin" color="secondary">
                    {{$t('landing:identify')}}
                  </v-btn>
                </div>
              </v-card-text>
              <v-card-actions></v-card-actions>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card>
              <v-card-title>
                <div class="headline">
                  {{$t('landing:guest')}}
                </div>
              </v-card-title>
              <v-card-text>
                <v-btn
                  to="/transaction" color="primary">
                  {{$t('landing:buyOnce')}}
                </v-btn>
                <v-btn
                  to="/subscribe" color="secondary">
                  {{$t('landing:subscribe')}}
                </v-btn>
              </v-card-text>
              <v-card-actions></v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import AuthenticationService from '@/service/AuthenticationService'

  export default {
    name: 'ardoise-landing',
    data () {
      i18n.i18next.addResources('en', 'landing', {
        title: 'Buying vegetables',
        subscribed: 'You are a subscriber',
        guest: 'You are not a subscriber',
        ardoiseIdentifier: 'Your slate identifier',
        identify: 'sign in',
        subscribe: 'become a subscriber',
        buyOnce: 'Purchase now',
        wrongLogin: 'Wrong subscriber code'
      })
      i18n.i18next.addResources('fr', 'landing', {
        title: 'Achat de légumes',
        subscribed: 'Vous êtes abonné',
        guest: 'Vous n\'êtes pas abonné',
        ardoiseIdentifier: 'Votre identifiant d\'ardoise',
        identify: 'se connecter',
        subscribe: 'devenir abonné',
        buyOnce: 'Faire un achat maintenant',
        wrongLogin: 'Mauvais code d\'abonné'
      })
      return {
        ardoiseIdentifier: '',
        rules: Rules,
        error: null
      }
    },
    methods: {
      ardoiseLogin: function () {
        this.error = null
        if (this.ardoiseIdentifier.trim() === 'sortir') {
          this.$store.dispatch('setToken', null)
          this.$store.dispatch('setUser', null)
          window.location.href = '/login'
          return
        }
        if (this.ardoiseIdentifier.trim() === '') {
          return
        }
        return AuthenticationService.ardoiseLogin(
          this.ardoiseIdentifier
        ).then(function (_user) {
          const user = _user.data
          this.$store.dispatch('setArdoiseUser', user)
          this.$router.push({
            name: 'ArdoiseTransaction'
          })
          if (user.locale) {
            this.$store.dispatch('setLocale', user.locale)
          }
        }.bind(this)).catch(function (error) {
          this.error = error.response.data.error
        }.bind(this))
      }
    },
    mounted: function () {
      this.$store.dispatch('setArdoiseUser', null)
    }

  }
</script>

<style scoped>

</style>
