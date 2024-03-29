<template>
  <panel :title="$t('transactions:title')">
    <v-card flat>
      <v-card-text class="black--text body-1">
        {{ $t('transactions:quantitySum') }}
        <strong class="ml-1">
          {{ transactionItemsFiltered.length }}
        </strong>
        <v-divider
            vertical
            class="mx-4 black--text"
        ></v-divider>
        {{ $t('transactions:quantitySum2') }}
        <strong class="ml-1">
          {{ quantityForFilteredTransactionItems }}
        </strong>
        <v-divider
            vertical
            class="mx-4 black--text"
        ></v-divider>
        {{ $t('transactions:quantitySum3') }}
        <strong class="ml-1">
          {{ moneyAmountForFilteredTransactionItems | currency }}
        </strong>
      </v-card-text>
      <v-divider class="mb-4"></v-divider>
      <v-card-title class="pt-0">
        <v-select
            :items="years"
            v-model="yearFilter"
            :label="$t('transactions:year')"
            @change="updateListWithYearFilter"
            class="mx-4"
        ></v-select>
      </v-card-title>
      <v-dialog
          ref="dialog"
          v-model="dayModal"
          :return-value.sync="dayFilter"
          persistent
          width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              :label="$t('transactions:day')"
              prepend-icon="calendar_today"
              readonly
              v-bind="attrs"
              v-on="on"
              class="mx-4"
              clearable
              @click:clear="dayFilter = null"
              :value="dayFilterFormatted"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="dayFilter"
            scrollable
            :locale="$store.state.locale"
        >
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="dayModal = false"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(dayFilter)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
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
        <template v-slot:item.TransactionId="{ item }">
          <a @click.prevent="enterBillDetails(item)" href="">
            {{ item.TransactionId }}
          </a>
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
        <template v-slot:item.withOrWithoutAccount="{ item }">
          <v-icon v-if="item.Transaction.UserId" class="ml-3">account_box</v-icon>
          <v-icon v-else class="ml-3">no_accounts</v-icon>
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
    <TransactionDetailsDialog
        ref="transactionDetailsDialog"
        :details="detailsForDialog"
        :billNumber="billNumber"
        :ardoiseUser="transactionUser" @removeTransaction="removeTransaction"></TransactionDetailsDialog>
  </panel>
</template>

<script>
import i18n from '@/i18n'
import DateUtil from '@/dateUtil'
import TransactionService from '@/service/TransactionService'
import dateUtil from "@/dateUtil";
import UserService from "@/service/UserService";

export default {
  name: 'TransactionItems',
  components: {
    TransactionDetailsDialog: () => import('@/components/shared/TransactionDetailsDialog')
  },
  data() {
    i18n.i18next.addResources('en', 'transactions', {
      title: 'Transaction items',
      quantitySum: 'rows, totaling',
      quantitySum2: 'quantities',
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
      noResults2: 'found no results',
      year: "Year",
      day: "Day",
      withOrWithoutAccount: "Account"
    })
    i18n.i18next.addResources('fr', 'transactions', {
      title: 'Items de transactions',
      quantitySum: 'rangées',
      quantitySum2: 'quantité',
      quantitySum3: 'montant',
      billNumber: '# Facture',
      name: 'Nom',
      format: 'Format',
      unitPrice: 'Prix unitaire',
      quantity: 'QTÉ',
      rebate: 'Rabais',
      totalPrice: 'Prix total',
      date: 'Date',
      noResults1: 'Votre recherche pour',
      noResults2: 'n\'a retourné aucun résultat',
      year: "Année",
      day: "Jour",
      withOrWithoutAccount: "Compte"
    })
    const currentYear = new Date().getFullYear();
    const firstYear = currentYear - 20;
    const years = [];
    for (let i = currentYear; i > firstYear; i--) {
      years.push(i);
    }
    return {
      detailsForDialog: [],
      billNumber: null,
      transactionUser: null,
      dayFilter: null,
      dayModal: false,
      tableOptions: {
        sortBy: ['updatedAt'],
        sortDesc: [true],
        itemsPerPage: 100
      },
      years: years,
      yearFilter: currentYear,
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
          text: this.$t('transactions:withOrWithoutAccount'),
          value: 'withOrWithoutAccount'
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
  mounted: function () {
    this.updateListWithYearFilter();
  },
  methods: {
    removeTransaction: function (transactionId) {
      let l = this.transactionItems.length;
      while (l--) {
        const transactionItem = this.transactionItems[l];
        if (transactionItem.TransactionId === transactionId) {
          this.transactionItems.splice(l, 1);
        }
      }
    },
    enterBillDetails: async function (transactionItemOfBill) {
      this.billNumber = transactionItemOfBill.TransactionId;
      this.detailsForDialog = this.transactionItems.filter((transactionItem) => {
        return transactionItem.TransactionId === transactionItemOfBill.TransactionId;
      });
      if (transactionItemOfBill.Transaction.UserId) {
        const response = await UserService.getDetails(transactionItemOfBill.Transaction.UserId);
        this.transactionUser = response.data;
      } else {
        this.transactionUser = null;
      }
      this.$refs.transactionDetailsDialog.enter();
    },
    updateListWithYearFilter: function () {
      TransactionService.listAllDetails(this.yearFilter).then(function (transactionItems) {
        this.transactionItems = transactionItems.data.map(function (item) {
          item.name = i18n.getText(item.Product.name)
          item.format = i18n.getText(item.Product.format)
          item.rebate = item.totalPriceAfterRebate - item.totalPrice
          item.date = DateUtil.getDayDate(item.updatedAt)
          return item
        })
      }.bind(this))
    }
  },
  computed: {
    dayFilterFormatted: function () {
      return DateUtil.getDayDate(this.dayFilter);
    },
    transactionItemsFiltered: function () {
      return this.transactionItems.filter((transactionItem) => {
        if (this.dayFilter !== null && !dateUtil.areDatesSameDay(new Date(transactionItem.updatedAt), new Date(this.dayFilter))) {
          return false;
        }
        const values = [
          transactionItem.name,
          transactionItem.format,
          transactionItem.date
        ]
        return values.some((value) => {
          return value !== null && value.toLowerCase().indexOf(this.search.toLowerCase().trim()) > -1
        });
      });
    },
    quantityForFilteredTransactionItems: function () {
      return this.transactionItemsFiltered.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0)
    },
    moneyAmountForFilteredTransactionItems: function () {
      return this.transactionItemsFiltered.reduce(function (sum, item) {
        return sum + item.totalPriceAfterRebate;
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
