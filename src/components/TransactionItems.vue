<template>
  <panel :title="$t('transactions:title')">
    <v-card>
      <v-card-title>
        <v-text-field
          append-icon="search"
          :label="$t('search')"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-card-title>
        <span class="font-weight-black mr-1">{{quantityForFilteredTransactionItems}}</span>:
        {{$t('transactions:quantitySum')}}
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="transactionItemsFiltered"
        disable-initial-sort
        class="elevation-1"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td>
            {{props.item.TransactionId}}
          </td>
          <td>{{ props.item.name}}</td>
          <td>{{ props.item.format}}</td>
          <td>
            {{ props.item.unitPrice | currency}}
          </td>
          <td>
            {{ props.item.quantity}}
          </td>
          <td>
            {{ props.item.rebate | currency}}
          </td>
          <td>
            {{ props.item.totalPriceAfterRebate | currency}}
          </td>
          <td>
            {{ props.item.date}}
          </td>
        </template>

        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          {{ $t('products:noResults1') }} "{{ search }}" {{ $t('products:noResults2') }}.
        </v-alert>
      </v-data-table>
    </v-card>
  </panel>
</template>

<script>
  import Vue from 'vue'
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
        pagination: {
          sortBy: 'TransactionId',
          descending: true,
          rowsPerPage: 100
        },
        headers: [
          {
            text: Vue.t('transactions:billNumber'),
            value: 'TransactionId'
          },
          {
            text: Vue.t('transactions:name'),
            value: 'name'
          },
          {
            text: Vue.t('transactions:format'),
            value: 'format'
          },
          {
            text: Vue.t('transactions:unitPrice'),
            value: 'unitPrice'
          },
          {
            text: Vue.t('transactions:quantity'),
            value: 'quantity'
          },
          {
            text: Vue.t('transactions:rebate'),
            value: 'rebate'
          },
          {
            text: Vue.t('transactions:totalPrice'),
            value: 'totalPriceAfterRebate'
          },
          {
            text: Vue.t('transactions:date'),
            value: 'date'
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
          return transactionItem.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
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
