<template>
  <panel :title="title">
    <transaction :user="$store.state.ardoiseUser"></transaction>
    <v-dialog
      v-model="showSessionExpiredSuccess"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline text-center">
          {{$t('aTransaction:inactivity')}}
        </v-card-title>
        <v-card-text>
          {{$t('aTransaction:beDisconnected')}} {{logoutTimeout}} {{$t('aTransaction:seconds')}}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="pull-right" @click="extendSession()">
            {{$t('aTransaction:extendSession')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </panel>
</template>

<script>
  import Transaction from '@/components/shared/Transaction'
  import i18n from '@/i18n'

  export default {
    name: 'ArdoiseTransaction',
    components: {Transaction},
    data () {
      i18n.i18next.addResources('en', 'aTransaction', {
        title: 'Purchase on account of',
        anonymousTitle: 'Anonymous purchase',
        products: 'Products',
        itemsOfPurchase: 'Items of purchase',
        completeTransaction: 'Complete transaction',
        beDisconnected: 'You will be disconnected in',
        extendSession: 'Extend session',
        seconds: 'seconds',
        inactivity: 'Inactivity'
      })
      i18n.i18next.addResources('fr', 'aTransaction', {
        title: 'Achat sur le compte de',
        anonymousTitle: 'Achat anonyme',
        products: 'Produits',
        itemsOfPurchase: 'Items de l\'achat',
        completeTransaction: 'Compléter la transaction',
        beDisconnected: 'Vous serez déconnecté dans',
        extendSession: 'Prolonger la session',
        seconds: 'seconds',
        inactivity: 'Inactivité'
      })
      return {
        showSessionExpiredSuccess: false,
        logoutTimeout: null,
        ardoiseLogoutInterval: null
      }
    },
    mounted: function () {
      clearInterval(this.ardoiseLogoutInterval)
    },
    methods: {
      ardoiseLogout: function () {
        clearInterval(this.ardoiseLogoutInterval)
        this.$router.push({
          name: 'ArdoiseLanding'
        })
        this.$store.dispatch('setArdoiseUser', null)
      },
      extendSession: function () {
        clearInterval(this.ardoiseLogoutInterval)
        this.showSessionExpiredSuccess = false
      }
    },
    computed: {
      title: function () {
        if (this.$store.state.ardoiseUser) {
          return this.$t('aTransaction:title') + ' ' + this.$store.state.ardoiseUser.firstName + ' ' + this.$store.state.ardoiseUser.lastName
        }
        return this.$t('aTransaction:anonymousTitle')
      }
    },
    onIdle () {
      this.logoutTimeout = 20
      this.showSessionExpiredSuccess = true
      this.ardoiseLogoutInterval = setInterval(function () {
        this.logoutTimeout--
        if (this.logoutTimeout <= 0) {
          clearInterval(
            this.ardoiseLogoutInterval
          )
          this.ardoiseLogout()
        }
      }.bind(this), 1000)
      this.showSessionExpiredSuccess = true
    }
  }
</script>

<style scoped>

</style>
