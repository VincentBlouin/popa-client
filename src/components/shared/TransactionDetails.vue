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
          >
            <img :src="props.item.image" class="left">
          </v-avatar>
          {{ props.item.name}}
        </td>
        <td>{{ props.item.format | currency}}</td>
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
                 :disabled="transactionItems.length === 0">
            {{$t('aTransaction:completeTransaction')}}
          </v-btn>
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
          <h4 class="text-xs-center">{{$t('details:yourBalanceIs')}} {{balance | currency}}</h4>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap flex align-center justify-center>
            <v-flex md6>
              {{$t('details:beDisconnected')}} {{disconnectTimeout}} {{$t('details:seconds')}}
            </v-flex>
            <v-flex md6>
              <v-btn color="primary" class="pull-right" @click="ardoiseDisconnect()">
                {{$t('details:disconnectNow')}}
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

  export default {
    name: 'transaction-details',
    data () {
      i18n.i18next.addResources('en', 'details', {
        noItemsOfPurchase: 'No items yet',
        yourBalanceIs: 'Your balance is now',
        beDisconnected: 'You will be disconnected in',
        disconnectNow: 'Disconnect now',
        seconds: 'seconds'
      })
      i18n.i18next.addResources('fr', 'details', {
        noItemsOfPurchase: 'Pas encore d\'items',
        yourBalanceIs: 'Votre solde est maintenant de',
        beDisconnected: 'Vous serez déconnecté dans',
        disconnectNow: 'Déconnecter maintenant',
        seconds: 'secondes'
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
        timeoutInterval: null
      }
    },
    props: [
      'products',
      'ardoiseUser'
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
        return this.ardoiseUser !== undefined
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
          this.balance = parseFloat(transaction.data.balance)
          this.disconnectTimeout = 10
          this.showTransactionMsgSuccess = true
          this.timeoutInterval = setInterval(function () {
            this.disconnectTimeout--
            if (this.disconnectTimeout <= 0) {
              this.ardoiseDisconnect()
            }
          }.bind(this), 1000)
        }.bind(this))
      },
      calculateRebate: function (product) {
        if (this.isArdoiseUser) {
          return (product.quantity * product.unitPrice) * 0.1
        }
        return 0
      },
      ardoiseDisconnect: function () {
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
