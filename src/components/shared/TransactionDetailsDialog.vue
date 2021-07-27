<template>
  <v-dialog v-model="billDetailsDialog" fullscreen>
    <v-card v-if="!billDetailsDialog">
      <v-card-text class="text-center">
        <v-icon class="fa-spin" x-large>loop</v-icon>
      </v-card-text>
    </v-card>
    <v-card v-if="billDetailsDialog">
      <v-toolbar dark color="secondary">
        <v-btn icon @click.native="billDetailsDialog = false; billDetailsDialog=null" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('detailsDialog:billNumber') }} {{ billNumber }}<br>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="ardoiseUser === null">
          {{ $t('detailsDialog:anonymousPurchase') }}
        </v-toolbar-title>
        <v-toolbar-title v-else>
          {{ ardoiseUser.firstName + ' ' + ardoiseUser.lastName }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mt-6">
        <TransactionDetails :products="details" :ardoiseUser="ardoiseUser" areTransactionsCommited="true"
                            :transactionId="billNumber" @removeTransaction="removeTransaction"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import TransactionDetails from '@/components/shared/TransactionDetails'
import i18n from "@/i18n";

export default {
  name: "TransactionDetailsDialog",
  props: ['details', 'ardoiseUser', 'billNumber'],
  components: {TransactionDetails},
  data: function () {
    i18n.i18next.addResources('fr', 'detailsDialog', {
      billNumber: '# Facture',
      anonymousPurchase: "Achat anonyme"
    })
    i18n.i18next.addResources('en', 'detailsDialog', {
      billNumber: 'Bill #',
      anonymousPurchase: "Anonymous purchase"
    })
    return {
      billDetailsDialog: false
    }
  },
  methods: {
    removeTransaction: function () {
      this.billDetailsDialog = false;
      this.$emit('removeTransaction', this.billNumber);
    },
    enter: function () {
      this.billDetailsDialog = true;
    }
  }
}
</script>

<style scoped>

</style>
