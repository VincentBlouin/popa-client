<template>
  <div>
    <panel
      :title="title">
      <v-subheader>
        <div>
          {{$t('aTransaction:itemsOfPurchase')}}
        </div>
      </v-subheader>
      <transaction-details :products="products" :ardoiseUser="$store.state.ardoiseUser"
                           @onTotal="setTransactionItemsTotal"/>
      <v-subheader>
        {{$t('aTransaction:products')}}
      </v-subheader>
      <v-layout row wrap>
        <v-flex xs12 sm3 md3 v-for="product in products">
          <v-card>
            <v-card-media
              class="white--text"
              height="200px"
              :src="product.image"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{product.name | i18n}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-title>
              <div>
              <span class="grey--text">
                {{$t('unitPrice')}}: {{product.unitPrice | currency}}
              </span><br>
                <span class="grey--text">
                {{$t('totalPrice')}}: {{(product.quantity * product.unitPrice) | currency}}
              </span><br>
                <span class="grey--text">
                {{$t('Format')}}: {{product.format | i18n}}<br>
              </span>
                <p>
                  {{product.description | i18n}}
                </p>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-layout>
                <v-flex xs4>
                  <v-btn icon color="primary" class="ml-3 left" @click="incrementQuantityForItem(product)">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4 class="text-xs-center grey--text" style="font-size:2em">
                  <span>{{product.quantity}}x</span>
                </v-flex>
                <v-flex xs4>
                  <v-btn icon color="primary" class="mr-3 right" @click="decrementQuantityForItem(product)">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <account-statement v-if="$store.state.ardoiseUser" :ardoiseUser="$store.state.ardoiseUser"></account-statement>
      <v-snackbar
        color="secondary"
        :timeout="9999999"
        top
        multi-line
        v-model="showConfirmSnackbar"
      >
        {{$t('aTransaction:total')}}: {{transactionItemsTotal | currency}}
        <v-btn dark color="primary" style="padding: 8px;" :disabled="products.length === 0"
               @click="showCompleteTransactionModal = true; showConfirmSnackbar= false">
          {{$t('aTransaction:completeTransaction')}}
        </v-btn>
        <v-btn icon dark color="secondary" @click.native="showConfirmMsg= false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </panel>
    <v-dialog v-model="showCompleteTransactionModal">
      <v-card>
        <v-card-text>
          <transaction-details :products="products" @onTotal="setTransactionItemsTotal"
                               :ardoiseUser="$store.state.ardoiseUser"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat
                 @click.native="showCompleteTransactionModal = false; showConfirmSnackbar = true">
            {{$t('close')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showSessionExpiredSuccess"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline text-xs-center">
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
  </div>
</template>
<script>
  import AccountStatement from '@/components/shared/AccountStatement'
  import TransactionDetails from '@/components/shared/TransactionDetails'
  import i18n from '@/i18n'
  import ProductService from '@/service/ProductService'
  import Rules from '@/rules'

  export default {
    name: 'transaction',
    components: {AccountStatement, TransactionDetails},
    data () {
      i18n.i18next.addResources('en', 'aTransaction', {
        title: 'Purchase on account of',
        anonymousTitle: 'Anonymous purchase',
        products: 'Products',
        itemsOfPurchase: 'Items of purchase',
        completeTransaction: 'Complete transaction',
        total: 'Total',
        Format: 'Format',
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
        total: 'Total',
        Format: 'Format',
        beDisconnected: 'Vous serez déconnecté dans',
        extendSession: 'Prolonger la session',
        seconds: 'seconds',
        inactivity: 'Inactivité'
      })
      this.disconnectAfterInactivity()
      return {
        showConfirmSnackbar: false,
        rules: Rules,
        products: [],
        showCompleteTransactionModal: false,
        transactionItemsTotal: 0,
        showSessionExpiredSuccess: false,
        logoutTimeout: null,
        ardoiseLogoutInterval: null
      }
    },
    mounted: function () {
      clearInterval(this.ardoiseLogoutInterval)
      ProductService.list().then(function (products) {
        products.data.forEach(function (product) {
          product.quantity = 0
        })
        this.products = products.data
      }.bind(this))
    },
    methods: {
      incrementQuantityForItem: function (item) {
        item.quantity++
        this.showConfirmSnackbar = true
      },
      decrementQuantityForItem: function (item) {
        if (item.quantity === 0) {
          return
        }
        item.quantity--
      },
      setTransactionItemsTotal: function (value) {
        this.transactionItemsTotal = value
      },
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
      },
      disconnectAfterInactivity: function () {
        let t
        window.onload = resetTimer.bind(this)
        document.onmousemove = resetTimer.bind(this)
        document.onkeypress = resetTimer.bind(this)
        document.onmousemove = resetTimer.bind(this)
        document.onmousedown = resetTimer.bind(this) // touchscreen presses
        document.ontouchstart = resetTimer.bind(this)
        document.onclick = resetTimer.bind(this) // touchpad clicks
        document.onscroll = resetTimer.bind(this) // scrolling with arrow keys

        function showArdoiseLogoutDialog () {
          clearTimeout(t)
          this.logoutTimeout = 20
          this.showSessionExpiredSuccess = true
          this.ardoiseLogoutInterval = setInterval(function () {
            this.logoutTimeout--
            if (this.logoutTimeout <= 0) {
              this.ardoiseLogout()
            }
          }.bind(this), 1000)
        }

        function resetTimer () {
          console.log('timer reset')
          clearTimeout(t)
          t = setTimeout(showArdoiseLogoutDialog.bind(this), 120 * 1000)
        }
      }
    },
    computed: {
      title: function () {
        if (this.$store.state.ardoiseUser) {
          return this.$t('aTransaction:title') + ' ' + this.$store.state.ardoiseUser.firstName + ' ' + this.$store.state.ardoiseUser.lastName
        }
        return this.$t('aTransaction:anonymousTitle')
      }
    }
  }
</script>

<style scoped>

</style>
