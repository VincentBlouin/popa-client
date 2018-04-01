<template>
  <div>
    <v-subheader>
      {{$t('statements:title')}}
    </v-subheader>
    <v-data-table
      :headers="headers"
      :items="transactions"
      :pagination.sync="pagination"
      :no-data-text="$t('statements:noTransactions')"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.createdAt | date}}</td>
        <td>{{ props.item.deposit | currency}}</td>
        <td>{{ props.item.withdrawal | currency}}</td>
        <td>{{ props.item.balance | currency}}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import Vue from 'vue'
  import TransactionService from '@/service/TransactionService'
  import i18n from '@/i18n'

  export default {
    name: 'account-statement',
    data () {
      i18n.i18next.addResources('en', 'statements', {
        title: 'Account statement',
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        balance: 'Balance',
        date: 'Date',
        noTransactions: 'No transactions'
      })
      i18n.i18next.addResources('fr', 'statements', {
        title: 'Relevé de compte',
        deposit: 'Dépôt',
        withdrawal: 'Retrait',
        balance: 'Balance',
        date: 'Date',
        noTransactions: 'Pas de transactions'
      })
      return {
        pagination: {
          sortBy: 'id',
          descending: true,
          rowsPerPage: -1
        },
        headers: [
          {
            text: Vue.t('statements:date'),
            value: 'createdAt'
          },
          {
            text: Vue.t('statements:deposit'),
            value: 'deposit'
          },
          {
            text: Vue.t('statements:withdrawal'),
            value: 'withdrawal'
          },
          {
            text: Vue.t('statements:balance'),
            value: 'balance'
          }
        ],
        'transactions': []
      }
    },
    props: [
      'ardoiseUser'
    ],
    mounted: function () {
      TransactionService.list(this.ardoiseUser).then(function (transactions) {
        transactions.data.forEach(function (transaction) {
          if (Math.sign(transaction.totalPrice) === 1) {
            transaction.withdrawal = transaction.totalPrice
          } else {
            transaction.deposit = transaction.totalPrice * -1
          }
        })
        this.transactions = transactions.data
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
