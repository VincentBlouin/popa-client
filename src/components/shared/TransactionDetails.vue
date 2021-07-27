<template>
  <div>
    <v-card flat class="mb-2">
      <v-card-text>
        <strong v-if="areTransactionsCommited && products">
          {{ products[0].createdAt | date }}
        </strong>
      </v-card-text>
    </v-card>
    <v-simple-table v-if="transactionItemsTotal > 0" class="mb-4">
      <template v-slot:default>
        <thead>
        <th v-for="header in headers" :key="header.value" class="text-left pl-4 s">
          {{ header.text }}
        </th>
        </thead>
        <tbody class="mt-4 mb-4">
        <tr
            v-for="item in transactionItems"
            :key="item.id"
        >
          <td class="text-left">
            <v-avatar
                size="36px"
                slot="activator"
                class="mr-6"
                v-if="item.image"
            >
              <img :src="ProductService.getImageUrl(item)" class="left">
            </v-avatar>
            {{ item.name | i18n }}
          </td>
          <td class="text-left">{{ item.format | i18n }}</td>
          <td class="text-left">{{ item.unitPrice | currency }}</td>
          <td class="text-left pl-6">
            {{ item.quantity }}
          </td>
          <td class="text-left">
            {{ calculateRebate(item) | currency }}
          </td>
          <td class="text-left">{{ (item.unitPrice * item.quantity - calculateRebate(item)) | currency }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <strong v-if="transactionItems.length > 0" class="subtitle-1 font-weight-bold">
              {{ transactionItemsTotal | currency }}
              <span class="text-capitalize">
                {{ $t('aTransaction:total') }}
            </span>
            </strong>
          </td>
        </tr>
        </tbody>
        <tfoot>
        </tfoot>
      </template>
    </v-simple-table>
    <span class="grey--text body-1 ml-8" v-if="transactionItemsTotal === 0">
      {{ $t('transaction:noItem') }}
    </span>
    <v-dialog v-model="confirmRemove" width="600">
      <v-card>
        <v-card-title>
          {{ $t('details:confirmRemove') }}
        </v-card-title>
        <v-card-actions>
          <v-btn text>
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="removeTransaction()" :loading="removeLoading" :disabled="removeLoading">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn color="primary" class="ml-2 left" @click="confirmRemove=true"
           :disabled="ardoiseUser !== null"
           v-if="areTransactionsCommited && transactionId && $store.state.user.status === 'admin'"
    >
      <v-icon>delete</v-icon>
      {{ $t('details:removeTransaction') }}
    </v-btn>
    <v-btn color="primary" class="ml-2 left" @click="completeTransaction()"
           :disabled="transactionItems.length === 0"
           v-if="!areTransactionsCommited"
    >
      {{ $t('details:completeTransaction') }}
    </v-btn>
    <v-dialog
        v-model="showTransactionMsgSuccess"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h6 text-center mb-4 vh-center">
          <span v-if="isArdoiseUser">
            {{ $t('details:yourBalanceIs') }} {{ balance | currency }}
          </span>
          <div v-if="!isArdoiseUser" class="text-center">
            <div>
              {{ $t('details:thankYou1') }} <strong>{{ transactionItemsTotal | currency }}</strong>
            </div>
            <div class="">
              {{ $t('details:thankYou') }}
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap flex align-center justify-center>
            <v-flex md6>
              {{ $t('details:beRedirected') }} {{ disconnectTimeout }} {{ $t('details:seconds') }}
            </v-flex>
            <v-flex md6 class="text-right">
              <v-btn color="primary" class="pull-right" @click="redirectToLanding()">
                {{ $t('finish') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import i18n from '@/i18n'
import TransactionService from '../../service/TransactionService'
import ProductService from '../../service/ProductService'

export default {
  name: 'transaction-details',
  data() {
    i18n.i18next.addResources('en', 'details', {
      noItemsOfPurchase: 'No items yet',
      yourBalanceIs: 'Your balance is now',
      beRedirected: 'You will be redirected in',
      redirectNow: 'Redirect now',
      seconds: 'seconds',
      thankYou: 'Thank you !',
      thankYou1: 'Please pay the amount of',
      completeTransaction: 'Complete transaction',
      removeTransaction: 'Remove transaction',
      confirmRemove: "Really remove this transaction"
    })
    i18n.i18next.addResources('fr', 'details', {
      noItemsOfPurchase: 'Pas encore d\'items',
      yourBalanceIs: 'Votre solde est maintenant de',
      beRedirected: 'Vous serez redirigé dans',
      redirectNow: 'Rediriger maintenant',
      seconds: 'secondes',
      thankYou: 'Merci !',
      thankYou1: 'Veuillez payer le montant de',
      completeTransaction: 'Compléter la transaction',
      removeTransaction: 'Supprimer la transaction',
      confirmRemove: "Vraiment supprimer cette transaction ?"
    })
    return {
      confirmRemove: false,
      tableOptions: {
        sortBy: ['nbInStock'],
        sortDesc: [true]
      },
      headers: [
        {
          text: this.$t('Name'),
          value: 'name'
        },
        {
          text: this.$t('Format'),
          value: 'format'
        },
        {
          text: this.$t('unitPrice'),
          value: 'unitPrice'
        },
        {
          text: this.$t('quantity'),
          value: 'quantity'
        },
        {
          text: this.$t('rebate'),
          value: 'rebate'
        },
        {
          text: this.$t('totalPrice')
        }
      ],
      showTransactionMsgSuccess: false,
      balance: null,
      disconnectTimeout: null,
      timeoutInterval: null,
      ProductService: ProductService,
      removeLoading: false
    }
  },
  props: [
    'products',
    'ardoiseUser',
    'areTransactionsCommited',
    'transactionId'
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
    removeTransaction: async function () {
      this.removeLoading = true;
      await TransactionService.removeTransaction(this.transactionId);
      this.removeLoading = false;
      this.$emit('removeTransaction');
    },
    completeTransaction: function () {
      this.$emit('completeTransaction');
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
      // if (this.isArdoiseUser && this.ardoiseUser.hasRebate) {
      //   return (product.quantity * product.unitPrice) * 0.1
      // }
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
