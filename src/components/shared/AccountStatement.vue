<template>
  <div>
    <v-subheader>
      {{ $t('statements:title') }}
    </v-subheader>
    <v-data-table
        :headers="headers"
        :items="transactions"
        disable-pagination
        :options="tableOptions"
        :no-data-text="$t('statements:noTransactions')"
        hide-default-footer
        class="elevation-1"
    >

      <template v-slot:item.createdAt="{ item }">
        {{ item.createdAt | date }}
      </template>
      <template v-slot:item.deposit="{ item }">
        {{ item.deposit | currency }}
      </template>
      <template v-slot:item.withdrawal="{ item }">
        {{ item.withdrawal | currency }}
      </template>
      <template v-slot:item.balance="{ item }">
        {{ item.balance | currency }}
      </template>
      <template v-slot:item.details="{ item }">
        <v-btn color="primary" @click="showDetails(item)">
          {{ $t('details') }}
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="detailsDialog" fullscreen>
      <v-card v-if="!billDetails">
        <v-card-text class="text-center">
          <v-icon class="fa-spin" x-large>loop</v-icon>
        </v-card-text>
      </v-card>
      <v-card v-if="billDetails">
        <v-toolbar dark color="secondary">
          <v-btn icon @click.native="detailsDialog = false; billDetails=null" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ $t('statements:billNumber') }} {{ billNumber }}<br>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            {{ ardoiseUser.firstName + ' ' + ardoiseUser.lastName }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="mt-6">
          <transaction-details :products="billDetails" :ardoiseUser="ardoiseUser" areTransactionsCommited="true"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TransactionService from '@/service/TransactionService'
import i18n from '@/i18n'
import TransactionDetails from '@/components/shared/TransactionDetails'

export default {
  name: 'account-statement',
  components: {TransactionDetails},
  data() {
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
      tableOptions: {
        sortBy: ['updatedAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: '#',
          value: 'id'
        },
        {
          text: this.$t('statements:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('statements:deposit'),
          value: 'deposit'
        },
        {
          text: this.$t('statements:withdrawal'),
          value: 'withdrawal'
        },
        {
          text: this.$t('statements:balance'),
          value: 'balance'
        },
        {
          text: '',
          value: 'details'
        }
      ],
      transactions: [],
      billDetails: null,
      detailsDialog: false,
      billNumber: null,
      billDate: null
    }
  },
  props: [
    'ardoiseUser'
  ],
  methods: {
    showDetails: function (transaction) {
      this.detailsDialog = true
      this.billNumber = transaction.id
      this.billDate = transaction.createdAt
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
