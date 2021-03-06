<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="transactionItems"
      :pagination.sync="pagination"
      :no-data-text="$t('details:noItemsOfPurchase')"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="">
          <v-avatar
            size="36px"
            slot="activator"
            class="mr-3"
            v-if="props.item.image"
          >
            <img :src="ProductService.getImageUrl(props.item)" class="left">
          </v-avatar>
          {{ props.item.name | i18n}}
        </td>
        <td>{{ props.item.format | i18n}}</td>
        <td>{{ props.item.unitPrice | currency}}</td>
        <td class="text-xs-center">
          {{props.item.quantity}}
        </td>
        <td>
          {{calculateRebate(props.item) | currency}}
        </td>
        <td>{{ (props.item.unitPrice * props.item.quantity - calculateRebate(props.item)) | currency}}</td>
      </template>
      <template slot="footer">
        <td>
          <v-btn color="primary" class="ml-3 mt-4 mb-4 left" @click="completeTransaction()"
                 :disabled="transactionItems.length === 0"
                 v-if="!areTransactionsCommited"
          >
            {{$t('details:completeTransaction')}}
          </v-btn>
          <small v-if="areTransactionsCommited && products">
            <strong>
              {{products[0].createdAt | date}}
            </strong>
          </small>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <strong v-if="transactionItems.length > 0">
            {{$t('aTransaction:total')}}
            {{transactionItemsTotal | currency}}
          </strong>
        </td>
      </template>
    </v-data-table>
    <v-dialog
      v-model="showTransactionMsgSuccess"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline text-xs-center">
          <h4 class="text-xs-center">
            <span v-if="isArdoiseUser">
              {{$t('details:yourBalanceIs')}} {{balance | currency}}
            </span>
            <span v-if="!isArdoiseUser">
              {{$t('details:thankYou')}} {{transactionItemsTotal | currency}}
            </span>
          </h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap flex align-center justify-center>
            <v-flex md6>
              {{$t('details:beRedirected')}} {{disconnectTimeout}} {{$t('details:seconds')}}
            </v-flex>
            <v-flex md6>
              <v-btn color="primary" class="pull-right" @click="redirectToLanding()">
                {{$t('details:redirectNow')}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n'
  import TransactionService from '../../service/TransactionService'
  import ProductService from '../../service/ProductService'

  export default {
    name: 'transaction-details',
    data () {
      i18n.i18next.addResources('en', 'details', {
        noItemsOfPurchase: 'No items yet',
        yourBalanceIs: 'Your balance is now',
        beRedirected: 'You will be redirected in',
        redirectNow: 'Redirect now',
        seconds: 'seconds',
        thankYou: 'Thank you, do not forget to pay the amount of',
        completeTransaction: 'Complete transaction'
      })
      i18n.i18next.addResources('fr', 'details', {
        noItemsOfPurchase: 'Pas encore d\'items',
        yourBalanceIs: 'Votre solde est maintenant de',
        beRedirected: 'Vous serez redirigé dans',
        redirectNow: 'Rediriger maintenant',
        seconds: 'secondes',
        thankYou: 'Merci, n\'oubliez pas de payer le montant de',
        completeTransaction: 'Compléter la transaction'
      })
      return {
        pagination: {
          sortBy: 'nbInStock',
          descending: true,
          rowsPerPage: -1
        },
        headers: [
          {
            text: Vue.t('Name'),
            value: 'name'
          },
          {
            text: Vue.t('Format'),
            value: 'format'
          },
          {
            text: Vue.t('unitPrice'),
            value: 'unitPrice'
          },
          {
            text: Vue.t('quantity'),
            value: 'quantity'
          },
          {
            text: Vue.t('rebate'),
            value: 'rebate'
          },
          {
            text: Vue.t('totalPrice')
          }
        ],
        showTransactionMsgSuccess: false,
        balance: null,
        disconnectTimeout: null,
        timeoutInterval: null,
        ProductService: ProductService
      }
    },
    props: [
      'products',
      'ardoiseUser',
      'areTransactionsCommited'
    ],
    computed: {
      transactionItems: function () {
        return this.products.filter(function (item) {
          return item.quantity > 0
        })
      },
      transactionItemsTotal: function () {
        return this.transactionItems.reduce(function (sum, item) {
          return sum + item.quantity * item.unitPrice - this.calculateRebate(item)
        }.bind(this), 0)
      },
      isArdoiseUser: function () {
        return this.ardoiseUser !== null
      },
      isSubscribedUserFlow: function () {
        return this.isArdoiseUser && this.$store.state.user.id === this.ardoiseUser.id
      }
    },
    watch: {
      transactionItemsTotal: function () {
        this.$emit(
          'onTotal',
          this.transactionItemsTotal
        )
      }
    },
    mounted: function () {
      clearInterval(this.timeoutInterval)
    },
    methods: {
      completeTransaction: function () {
        const transaction = this.ardoiseUser ? TransactionService.addForUser(
          this.transactionItems,
          this.ardoiseUser
        ) : TransactionService.addForAnonymous(
          this.transactionItems
        )
        transaction.then(function (transaction) {
          if (this.isSubscribedUserFlow) {
            return this.$router.push({
              name: 'AccountStatementPage'
            })
          }
          this.balance = parseFloat(transaction.data.balance)
          this.disconnectTimeout = 20
          this.showTransactionMsgSuccess = true
          this.timeoutInterval = setInterval(function () {
            this.disconnectTimeout--
            if (this.disconnectTimeout <= 0) {
              this.redirectToLanding()
            }
          }.bind(this), 1000)
        }.bind(this))
      },
      calculateRebate: function (product) {
        if (this.areTransactionsCommited) {
          return product.totalPrice - product.totalPriceAfterRebate
        }
        if (this.isArdoiseUser && this.ardoiseUser.hasRebate) {
          return (product.quantity * product.unitPrice) * 0.1
        }
        return 0
      },
      redirectToLanding: function () {
        clearInterval(this.timeoutInterval)
        this.$store.dispatch('setArdoiseUser', null)
        this.$router.push({
          name: 'ArdoiseLanding'
        })
      }
    }
  }
</script>

<style scoped>

</style>
