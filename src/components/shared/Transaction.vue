<template>
  <div>
    <v-toolbar class="mb-12" elevation="0">
      <v-btn color="primary" @click="back" class="mt-3 mb-3 ml-3">
        {{ $t('cancel') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :dark="transactionItemsTotal > 0" color="primary" :disabled="transactionItemsTotal <= 0"
             @click="showCompleteTransactionModal = true; showConfirmSnackbar= false;">
        {{ $t('transaction:completeTransaction') }}
      </v-btn>
    </v-toolbar>
    <v-layout row wrap style="" class="ml-1">
      <v-flex xs12 sm6 md4 lg4 xl2 v-for="product in products" :key="product.id">
        <v-card class="mr-6 mb-6">
          <v-img
              :src="ProductService.getImageUrl(product)"
              class="white--text align-start"
              height="200px"
          >
            <v-chip class="headline mt-4 ml-4" color="secondary" text-color="white">
              {{ product.name | i18n }}
            </v-chip>
          </v-img>
          <v-card-title class="body-1">
            <div>
              <strong>{{ $t('unitPrice') }}</strong>
              {{ product.unitPrice | currency }}
              <br>
              <strong>{{ $t('totalPrice') }}</strong>
              {{ (product.quantity * product.unitPrice) | currency }}
              <br>
              <strong>{{ $t('Format') }}</strong>
              {{ product.format | i18n }}
              <p class="black--text mt-2" v-if="product.description">
                {{ product.description | i18n }}
              </p>
            </div>
          </v-card-title>
          <v-card-actions class="mb-2 pl-0">
            <v-layout>
              <v-flex xs4 class="text-left">
                <v-btn fab small color="primary" class="ml-6 left" @click="decrementQuantityForItem(product)">
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs4 class="text-center grey--text" style="font-size:2em">
                <span>{{ product.quantity }}x</span>
              </v-flex>
              <v-flex xs4 class="text-right">
                <v-btn fab small color="primary" class="mr-6 right" @click="incrementQuantityForItem(product)">
                  <v-icon>add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <account-statement v-if="user" :ardoiseUser="user"></account-statement>
    <v-snackbar
        color="secondary"
        :timeout="9999999"
        bottom
        multi-line
        v-model="showConfirmSnackbar"
        class="pl-8 pb-8"
    >
      <span class="font-weight-bold body-1">
        {{ $t('transaction:total') }}: {{ transactionItemsTotal | currency }}
      </span>
      <v-btn dark color="primary" class="ml-8" :disabled="products.length === 0"
             @click="showCompleteTransactionModal = true; showConfirmSnackbar= false;">
        {{ $t('transaction:completeTransaction') }}
      </v-btn>
      <template v-slot:action="{ attrs }">
        <v-btn icon dark color="secondary" class="ml-8" @click.native="showConfirmSnackbar = false" v-bind="attrs">
          <v-icon color="white">close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showCompleteTransactionModal" eager>
      <v-card>
        <v-card-text class="pt-8">
          <transaction-details :products="products" @onTotal="setTransactionItemsTotal"
                               :ardoiseUser="user"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text
                 @click.native="showCompleteTransactionModal = false; showConfirmSnackbar = true">
            {{ $t('close') }}
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
  data() {
    i18n.i18next.addResources('en', 'transaction', {
      title: 'Purchase on account of',
      anonymousTitle: 'Anonymous purchase',
      products: 'Products',
      itemsOfPurchase: 'Items of purchase',
      completeTransaction: 'Complete transaction',
      total: 'Total',
      Format: 'Format',
      noItem: "No item"
    })
    i18n.i18next.addResources('fr', 'transaction', {
      title: 'Achat sur le compte de',
      anonymousTitle: 'Achat anonyme',
      products: 'Produits',
      itemsOfPurchase: 'Items de l\'achat',
      completeTransaction: 'Compléter la transaction',
      total: 'Total',
      Format: 'Format',
      noItem: "Aucun item"
    })
    return {
      showConfirmSnackbar: false,
      rules: Rules,
      products: [],
      showCompleteTransactionModal: false,
      transactionItemsTotal: 0,
      ProductService: ProductService
    }
  },
  mounted: function () {
    ProductService.listAvailable().then(function (response) {
      response.data.forEach(function (product) {
        product.quantity = 0
      })
      this.products = response.data.sort(function (a, b) {
        let aText = i18n.getText(a.name).toLowerCase()
        let bText = i18n.getText(b.name).toLowerCase()
        if (aText < bText) return -1
        if (aText > bText) return 1
        return 0
      })
    }.bind(this))
  },
  methods: {
    back: function () {
      window.history.back()
    },
    incrementQuantityForItem: async function (item) {
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
    }
  },
  props: [
    'user'
  ]
}
</script>

<style scoped>

</style>
