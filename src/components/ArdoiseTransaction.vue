<template>
  <div>
    <panel
      :title="$t('aTransaction:title') + ' ' + $store.state.ardoiseUser.firstName + ' ' + $store.state.ardoiseUser.lastName">
      <v-subheader>
        <div>
          {{$t('aTransaction:itemsOfPurchase')}}
          <!--<br>-->
          <!--<small v-if="transactionItems.length === 0">{{$t('aTransaction:noItemsOfPurchase')}}</small>-->
        </div>
      </v-subheader>
      <transaction-details :products="products" :isArdoiseUser="$store.state.ardoiseUser !== undefined" @onTotal="setTransactionItemsTotal"/>
      <!--<v-list two-line subheader>-->
      <!--<div v-for="item in transactionItems" :key="item.id">-->
      <!--<v-list-tile avatar>-->
      <!--<v-list-tile-action class="mr-3">-->
      <!--<v-checkbox v-model="item.name"></v-checkbox>-->
      <!--<v-text-field-->
      <!--type="number"-->
      <!--max="999"-->
      <!--min="1"-->
      <!--name="quantity"-->
      <!--placeholder="0"-->
      <!--:label="$t('aTransaction:quantity')"-->
      <!--small-->
      <!--required-->
      <!--auto-grow-->
      <!--hide-details-->
      <!--:rules="[rules.required]"-->
      <!--v-model="item.quantity"-->
      <!--&gt;</v-text-field>-->
      <!--</v-list-tile-action>-->
      <!--<v-list-tile-avatar>-->
      <!--<img :src="item.image">-->
      <!--</v-list-tile-avatar>-->
      <!--<v-list-tile-content>-->
      <!--<v-list-tile-title>{{ item.name}}</v-list-tile-title>-->
      <!--<v-list-tile-sub-title>{{ item.description}}</v-list-tile-sub-title>-->
      <!--</v-list-tile-content>-->
      <!--<v-list-tile-action>-->
      <!--<v-btn icon ripple @click="removeItemFromPurchase(item)">-->
      <!--<v-icon color="grey lighten-1">delete</v-icon>-->
      <!--</v-btn>-->
      <!--</v-list-tile-action>-->
      <!--</v-list-tile>-->
      <!--<v-divider inset></v-divider>-->
      <!--</div>-->
      <!--</v-list>-->
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
                    <span class="headline">{{product.name}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-title>
              <div>
              <span class="grey--text">
                {{$t('unitPrice')}}: {{product.unitPrice}}$
              </span><br>
                <span class="grey--text">
                {{$t('totalPrice')}}: {{product.quantity * product.unitPrice}}$
              </span><br>
                <span class="grey--text">
                {{$t('Format')}}: {{product.format}}<br>
              </span>
                <p>
                  {{product.description}}
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
      <account-statement :ardoiseUser="$store.state.ardoiseUser"></account-statement>
      <v-snackbar
        color="secondary"
        :timeout="9999999"
        top
        multi-line
        v-model="showConfirmSnackbar"
      >
        {{$t('aTransaction:total')}}: {{transactionItemsTotal}}$
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
          <transaction-details :products="products" @onTotal="setTransactionItemsTotal"/>
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
    name: 'ardoise-transaction',
    components: {AccountStatement, TransactionDetails},
    data () {
      i18n.i18next.addResources('en', 'aTransaction', {
        title: 'Purchase on account of',
        products: 'Products',
        itemsOfPurchase: 'Items of purchase',
        completeTransaction: 'Complete transaction',
        total: 'Total',
        Format: 'Format',
        seeSummary: 'see summary'
      })
      i18n.i18next.addResources('fr', 'aTransaction', {
        title: 'Achat sur le compte de',
        products: 'Produits',
        itemsOfPurchase: 'Items de l\'achat',
        completeTransaction: 'Compléter la transaction',
        total: 'Total',
        Format: 'Format',
        seeSummary: 'voir résumé'
      })
      return {
        showConfirmSnackbar: false,
        rules: Rules,
        products: [],
        showCompleteTransactionModal: false,
        transactionItemsTotal: 0
      }
    },
    mounted: function () {
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
      removeItemFromPurchase: function (item) {
        item.quantity = 0
      },
      seeSummary: function () {
        window.scrollTo(0, 0)
      },
      setTransactionItemsTotal: function (value) {
        this.transactionItemsTotal = value
      }
    }
  }
</script>

<style scoped>

</style>
