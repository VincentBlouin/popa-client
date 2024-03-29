<template>
  <panel :title="title">
    <v-card raised class="mt-6 mb-6">
      <v-card-text>
        <v-form name="subscriberForm" ref="subscriberForm">
<!--          <v-checkbox-->
<!--            :label="$t('subscriber:hasRebate')"-->
<!--            v-model="subscriber.hasRebate"-->
<!--          />-->
          <v-text-field
            :label="$t('subscriber:email')"
            v-model="subscriber.email"
            :rules="[rules.email]"
            type="email"
          ></v-text-field>
          <v-text-field
            :label="$t('subscriber:firstName')"
            required
            :rules="[rules.required]"
            v-model="subscriber.firstName"
          ></v-text-field>
          <v-text-field
            :label="$t('subscriber:lastName')"
            required
            :rules="[rules.required]"
            v-model="subscriber.lastName"
          ></v-text-field>
          <v-text-field
            :label="$t('subscriber:ardoisePassword')"
            required
            :rules="[rules.required]"
            v-model="subscriber.ardoiseIdentifier"
          ></v-text-field>
          <v-select
            :label="$t('subscriber:language')"
            :items="languages"
            item-value="text"
            v-model="subscriber.locale"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="create()" v-if="isCreate">
          {{$t('subscriber:add')}}
        </v-btn>
        <v-btn color="primary" @click="edit()" v-if="!isCreate">
          {{$t('subscriber:edit')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-divider></v-divider>
    <v-card v-if="!isCreate" raised class="mt-6 mb-6">
      <v-card-title>
        {{$t('subscriber:addFund')}}
      </v-card-title>
      <v-card-text>
        <v-text-field
          type="number"
          min="0"
          :label="$t('subscriber:fundAmount')"
          v-model="basketDeposit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFund()" v-if="!isCreate">
          {{$t('subscriber:add')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-divider></v-divider>
    <v-card v-if="!isCreate" raised class="mt-6 mb-6">
      <v-card-title>
        {{$t('subscriber:addPenalty')}}
      </v-card-title>
      <v-card-text>
        <v-text-field
          type="number"
          min="0"
          :label="$t('subscriber:penaltyFee')"
          v-model="penaltyAmount"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addPenalty()" v-if="!isCreate">
          {{$t('subscriber:add')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="!isCreate">
      <v-card-text>
        <account-statement :ardoiseUser="subscriber" v-if="!refreshAccountStatement"></account-statement>
      </v-card-text>
    </v-card>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import UserService from '../service/UserService'
  import TransactionService from '../service/TransactionService'
  import AccountStatement from '@/components/shared/AccountStatement'
  import Vue from 'vue'

  export default {
    name: 'subscriber',
    components: {AccountStatement},
    data () {
      i18n.i18next.addResources('en', 'subscriber', {
        addTitle: 'Add subscriber',
        editTitle: 'Edit subscriber',
        email: 'Email',
        firstName: 'First name',
        lastName: 'Last name',
        ardoisePassword: 'Ardoise password',
        add: 'Add',
        edit: 'Modify',
        fundAmount: 'Amount to add to account',
        addFund: 'Add fund to basket',
        penaltyFee: 'Penalty fee',
        addPenalty: 'Add no transactions fee',
        language: 'Language',
        hasRebate: 'Has 10% rebate'
      })
      i18n.i18next.addResources('fr', 'subscriber', {
        addTitle: 'Ajouter un abonné',
        editTitle: 'Modifier le compte d\'un abonné',
        email: 'Courriel',
        firstName: 'Prénom',
        lastName: 'Nom',
        ardoisePassword: 'Mot de passe d\'ardoise',
        add: 'Ajouter',
        edit: 'Modifier',
        fundAmount: 'Montant d\'ajout au compte',
        addFund: 'Ajouter fonds dans le panier',
        penaltyFee: 'Frais de pénalité',
        addPenalty: 'Ajouter un frais d\'absence de transactions',
        language: 'Langue',
        hasRebate: 'A le rabais de 10%'
      })
      return {
        subscriber: {},
        rules: Rules,
        basketDeposit: null,
        refreshAccountStatement: false,
        languages: [{
          text: 'fr',
          value: 'fr'
        }, {
          text: 'en',
          value: 'en'
        }],
        penaltyAmount: null
      }
    },
    methods: {
      create: function () {
        if (!this.$refs.subscriberForm.validate()) {
          return
        }
        UserService.createClient(
          this.subscriber
        ).then(function (client) {
          this.subscriber = client.data
          this.$router.push({
            path: '/subscriber/' + this.subscriber.id
          })
        }.bind(this))
      },
      edit: function () {
        if (!this.$refs.subscriberForm.validate()) {
          return
        }
        UserService.updateClient(
          this.subscriber
        )
      },
      addFund: function () {
        if (!this.basketDeposit || this.basketDeposit <= 0) {
          return
        }
        const amount = this.basketDeposit
        this.basketDeposit = null
        TransactionService.addFundToSubscriber(
          amount,
          this.subscriber
        ).then(function () {
          this.refreshAccountStatement = true
          Vue.nextTick(function () {
            this.refreshAccountStatement = false
          }.bind(this))
        }.bind(this))
      },
      addPenalty: function () {
        if (!this.penaltyAmount || this.penaltyAmount <= 0) {
          return
        }
        const amount = this.penaltyAmount
        this.penaltyAmount = null
        TransactionService.addPenaltyToSubscriber(
          amount,
          this.subscriber
        ).then(function () {
          this.refreshAccountStatement = true
          Vue.nextTick(function () {
            this.refreshAccountStatement = false
          }.bind(this))
        }.bind(this))
      }
    },
    computed: {
      isCreate: function () {
        return this.subscriber.id === undefined
      },
      title: function () {
        return this.isCreate ? this.$t('subscriber:addTitle') : this.$t('subscriber:editTitle')
      }
    },
    mounted: function () {
      this.subscriber.id = this.$route.params.subscriberId
      if (!this.subscriber.id) {
        return
      }
      UserService.getDetails(this.subscriber.id).then(function (subscriber) {
        this.subscriber = subscriber.data
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
