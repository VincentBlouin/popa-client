<template>
  <panel :title="title">
    <v-card>
      <v-card-text>
        <v-form name="subscriberForm" ref="subscriberForm">
          <v-text-field
            :label="$t('subscriber:email')"
            v-model="subscriber.email"
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
    <v-card>
      <v-card-text>
        <v-text-field
          type="number"
          required
          :label="$t('subscriber:addFund')"
          :rules="[rules.required]"
          v-model="basketDeposit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addFund()" v-if="!isCreate">
          {{$t('subscriber:add')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-text>
        <account-statement v-if="!isCreate" :ardoiseUser="subscriber"></account-statement>
      </v-card-text>
    </v-card>
  </panel>
</template>

<script>
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import UserService from '../service/UserService'
  import AccountStatement from '@/components/shared/AccountStatement'
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
        basketDeposit: 0
      }
    },
    methods: {
      create: function () {
        UserService.createClient(
          this.subscriber
        ).then(function (client) {
          this.$router.push({
            name: 'ChangeSubscriber',
            path: '/subscriber/' + client.data.id
          })
        }.bind(this))
      },
      edit: function () {
        UserService.updateClient(
          this.subscriber
        )
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
      if (!this.isCreate) {
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
