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
        <td>{{ props.item.id}}</td>
        <td>{{ props.item.createdAt | date}}</td>
        <td>{{ props.item.deposit | currency}}</td>
        <td>{{ props.item.withdrawal | currency}}</td>
        <td>{{ props.item.balance | currency}}</td>
        <td>
          <v-btn color="primary" @click="showDetails(props.item)">
            {{$t('details')}}
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="detailsDialog" fullscreen>
      <v-card v-if="!billDetails">
        <v-card-text class="text-xs-center">
          <v-icon class="fa-spin" x-large>loop</v-icon>
        </v-card-text>
      </v-card>
      <v-card v-if="billDetails">
        <v-toolbar dark color="secondary">
          <v-btn icon @click.native="detailsDialog = false; billDetails=null" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{$t('statements:billNumber')}} {{billNumber}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            {{ardoiseUser.firstName + ' ' + ardoiseUser.lastName}}
          </v-toolbar-title>
          <!--<v-btn color="dark" flat @click.native="detailsDialog = false; billDetails=null">-->
          <!--{{$t('close')}}-->
          <!--</v-btn>-->
        </v-toolbar>
        <v-card-text>
          <transaction-details :products="billDetails" :ardoiseUser="$store.state.ardoiseUser" hideComplete="true"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import Vue from 'vue'
  import TransactionService from '@/service/TransactionService'
  import i18n from '@/i18n'
  import TransactionDetails from '@/components/shared/TransactionDetails'

  export default {
    name: 'account-statement',
    components: {TransactionDetails},
    data () {
      i18n.i18next.addResources('en', 'statements', {
        title: 'Account statement',
        deposit: 'Deposit',
        withdrawal: 'Withdrawal',
        balance: 'Balance',
        date: 'Date',
        noTransactions: 'No transactions',
        billNumber: 'Bill #'
      })
      i18n.i18next.addResources('fr', 'statements', {
        title: 'Relevé de compte',
        deposit: 'Dépôt',
        withdrawal: 'Retrait',
        balance: 'Balance',
        date: 'Date',
        noTransactions: 'Pas de transactions',
        billNumber: 'Facture #'
      })
      return {
        pagination: {
          sortBy: 'id',
          descending: true,
          rowsPerPage: -1
        },
        headers: [
          {
            text: '#',
            value: 'id'
          },
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
          },
          {
            text: '',
            value: ''
          }
        ],
        transactions: [],
        billDetails: null,
        detailsDialog: false,
        billNumber: null
      }
    },
    props: [
      'ardoiseUser'
    ],
    methods: {
      showDetails: function (transaction) {
        this.detailsDialog = true
        this.billNumber = transaction.id
        TransactionService.getDetails(
          this.$store.state.user,
          transaction
        ).then(function (response) {
          this.billDetails = response.data.map(function (item) {
            item.name = item.Product.name
            item.format = item.Product.format
            return item
          })
        }.bind(this))
      }
    },
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
