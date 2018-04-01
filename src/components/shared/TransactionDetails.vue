<template>
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
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n'
  import TransactionService from '../../service/TransactionService'

  export default {
    name: 'transaction-details',
    data () {
      i18n.i18next.addResources('en', 'details', {
        noItemsOfPurchase: 'No items yet'
      })
      i18n.i18next.addResources('fr', 'details', {
        noItemsOfPurchase: 'Pas encore d\'items'
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
        ]
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
    methods: {
      completeTransaction: function () {
        var transaction = this.ardoiseUser ? TransactionService.addForUser(
          this.products,
          this.ardoiseUser
        ) : TransactionService.addForAnonymous(
          this.products
        )
        transaction.then(function(){

        });
      },
      calculateRebate: function (product) {
        if (this.isArdoiseUser) {
          return (product.quantity * product.unitPrice) * 0.1
        }
        return 0
      }
    }
  }
</script>

<style scoped>

</style>
