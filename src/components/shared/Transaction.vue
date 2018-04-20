<template>
  <div>
    <v-subheader>
      <div>
        {{$t('transaction:itemsOfPurchase')}}
      </div>
    </v-subheader>
    <transaction-details :products="products" :ardoiseUser="user"
                         @onTotal="setTransactionItemsTotal"/>
    <v-subheader>
      {{$t('transaction:products')}}
    </v-subheader>
    <v-layout row wrap style="">
      <v-flex xs12 sm4 md4 lg2 v-for="product in products">
        <v-card class="mr-3 mb-3">
          <v-card-media
            class="white--text"
            height="200px"
            :src="ProductService.getImageUrl(product)"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <v-chip class="headline" color="secondary" text-color="white">
                    {{product.name | i18n}}
                  </v-chip>
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
          <v-card-actions class="mb-2">
            <v-layout>
              <v-flex xs4>
                <v-btn icon color="primary" class="ml-3 left" @click="decrementQuantityForItem(product)">
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs4 class="text-xs-center grey--text" style="font-size:2em">
                <span>{{product.quantity}}x</span>
              </v-flex>
              <v-flex xs4>
                <v-btn icon color="primary" class="mr-3 right" @click="incrementQuantityForItem(product)">
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
      top
      multi-line
      v-model="showConfirmSnackbar"
    >
      {{$t('transaction:total')}}: {{transactionItemsTotal | currency}}
      <v-btn dark color="primary" style="padding: 8px;" :disabled="products.length === 0"
             @click="showCompleteTransactionModal = true; showConfirmSnackbar= false">
        {{$t('transaction:completeTransaction')}}
      </v-btn>
      <v-btn icon dark color="secondary" @click.native="showConfirmSnackbar = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="showCompleteTransactionModal">
      <v-card>
        <v-card-text>
          <transaction-details :products="products" @onTotal="setTransactionItemsTotal"
                               :ardoiseUser="user"/>
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
      i18n.i18next.addResources('en', 'transaction', {
        title: 'Purchase on account of',
        anonymousTitle: 'Anonymous purchase',
        products: 'Products',
        itemsOfPurchase: 'Items of purchase',
        completeTransaction: 'Complete transaction',
        total: 'Total',
        Format: 'Format'
      })
      i18n.i18next.addResources('fr', 'transaction', {
        title: 'Achat sur le compte de',
        anonymousTitle: 'Achat anonyme',
        products: 'Produits',
        itemsOfPurchase: 'Items de l\'achat',
        completeTransaction: 'Compléter la transaction',
        total: 'Total',
        Format: 'Format'
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
      ProductService.listAvailable().then(function (products) {
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
      }
    },
    props: [
      'user'
    ]
  }
</script>

<style scoped>

</style>
