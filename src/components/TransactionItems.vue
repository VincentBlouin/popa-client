<template>
  <panel :title="$t('transactions:title')">
    <v-card flat>
      <v-card-title>
        <span class="font-weight-black mr-1">{{ quantityForFilteredTransactionItems }}</span>:
        {{ $t('transactions:quantitySum') }}
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="transactionItemsFiltered"
          class="elevation-1"
          :options="tableOptions"
      >
        <template v-slot:top>
          <v-text-field
              prepend-inner-icon="search"
              :label="$t('search')"
              single-line
              hide-details
              v-model="search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:item.unitPrice="{ item }">
          {{ item.unitPrice | currency }}
        </template>
        <template v-slot:item.rebate="{ item }">
          {{ item.rebate | currency }}
        </template>
        <template v-slot:item.totalPriceAfterRebate="{ item }">
          {{ item.totalPriceAfterRebate | currency }}
        </template>
        <template v-slot:item.updatedAt="{ item }">
          {{ item.date }}
        </template>
        <v-layout slot="no-results">
          <v-flex xs3></v-flex>
          <v-flex xs6 class="text-h6">
            {{ $t('transactions:noResults1') }} "{{ search }}" {{ $t('transactions:noResults2') }}.
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-data-table>
    </v-card>
  </panel>
</template>

<script>
import i18n from '@/i18n'
import DateUtil from '@/dateUtil'
import TransactionService from '@/service/TransactionService'

export default {
  name: 'Products',
  data() {
    i18n.i18next.addResources('en', 'transactions', {
      title: 'Transaction items',
      quantitySum: 'sum of the quantities of filtered transactions',
      name: 'Name',
      billNumber: 'Bill #',
      format: 'Format',
      unitPrice: 'Unit price',
      quantity: 'QTY',
      rebate: 'Rabais',
      totalPrice: 'Total price',
      date: 'Date',
      notAvailable: 'Not available',
      noResults1: 'Your search for',
      noResults2: 'found no results'
    })
    i18n.i18next.addResources('fr', 'transactions', {
      title: 'Items de transactions',
      quantitySum: 'somme des quantités des transactions filtrés',
      billNumber: '# Facture',
      name: 'Nom',
      format: 'Format',
      unitPrice: 'Prix unitaire',
      quantity: 'QTÉ',
      rebate: 'Rabais',
      totalPrice: 'Prix total',
      date: 'Date',
      noResults1: 'Votre recherche pour',
      noResults2: 'n\'a retourné aucun résultat'
    })
    return {
      tableOptions: {
        sortBy: ['TransactionId'],
        descending: true,
        itemsPerPage: 100
      },
      headers: [
        {
          text: this.$t('transactions:billNumber'),
          value: 'TransactionId'
        },
        {
          text: this.$t('transactions:name'),
          value: 'name'
        },
        {
          text: this.$t('transactions:format'),
          value: 'format'
        },
        {
          text: this.$t('transactions:unitPrice'),
          value: 'unitPrice'
        },
        {
          text: this.$t('transactions:quantity'),
          value: 'quantity'
        },
        {
          text: this.$t('transactions:rebate'),
          value: 'rebate'
        },
        {
          text: this.$t('transactions:totalPrice'),
          value: 'totalPriceAfterRebate'
        },
        {
          text: this.$t('transactions:date'),
          value: 'updatedAt'
        }
      ],
      transactionItems: [],
      search: ''
    }
  },
  methods: {},
  mounted: function () {
    TransactionService.listAllDetails().then(function (transactionItems) {
      this.transactionItems = transactionItems.data.map(function (item) {
        item.name = i18n.getText(item.Product.name)
        item.format = i18n.getText(item.Product.format)
        item.rebate = item.totalPriceAfterRebate - item.totalPrice
        item.date = DateUtil.getDayDate(item.updatedAt)
        return item
      })
    }.bind(this))
  },
  computed: {
    transactionItemsFiltered: function () {
      return this.transactionItems.filter((transactionItem) => {
        const values = [
          transactionItem.name,
          transactionItem.format,
          transactionItem.date
        ]
        return values.some((value) => {
          return value !== null && value.toLowerCase().indexOf(this.search) > -1
        });
      });
    },
    quantityForFilteredTransactionItems: function () {
      return this.transactionItemsFiltered.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
