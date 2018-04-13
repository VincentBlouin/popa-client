<template>
  <panel :title="title">
    <v-card>
      <v-card-text>
        <v-form name="subscriberForm" ref="subscriberForm">
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
    <v-card v-if="!isCreate">
      <v-card-text>
        <v-text-field
          type="number"
          min="0"
          :label="$t('subscriber:addFund')"
          v-model="basketDeposit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFund()" v-if="!isCreate">
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
        addFund: 'Add fund to basket'
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
        addFund: 'Ajouter fonds dans le panier'
      })
      return {
        subscriber: {},
        rules: Rules,
        basketDeposit: null,
        refreshAccountStatement: false
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
      UserService.getDetails(this.subscriber).then(function (subscriber) {
        this.subscriber = subscriber.data
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
