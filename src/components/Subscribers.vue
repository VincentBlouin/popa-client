<template>
  <panel :title="$t('subscribers:title')">
    <v-card flat>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="addUser()" fab absolute right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-data-table
          :headers="headers"
          :items="subscribers"
          :search="search"
          hide-default-footer
          class="elevation-1"
          disable-pagination
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
        <template v-slot:item.balance="{ item }">
          {{ item.balance | currency }}
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
        </template>
        <template v-slot:item.latestTransaction="{ item }">
          {{ item.latestTransaction | dayDate }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn icon class="mx-0" @click="editUser(item)">
            <v-icon color="secondary">edit</v-icon>
          </v-btn>
        </template>
        <v-layout slot="no-results">
          <v-flex xs3></v-flex>
          <v-flex xs6 class="text-h6">
            {{ $t('subscribers:noResults1') }} "{{ search }}" {{ $t('subscribers:noResults2') }}.
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-data-table>
    </v-card>
  </panel>
</template>

<script>
import i18n from '@/i18n'
import UserService from '@/service/UserService'

export default {
  name: 'subscribers',
  data() {
    i18n.i18next.addResources('en', 'subscribers', {
      title: 'Subscribers',
      firstName: 'Firstname',
      lastName: 'Lastname',
      noResults1: 'Your search for',
      noResults2: 'found no results',
      status: 'Status',
      date: 'Creation day',
      balance: 'Balance',
      lastTransaction: 'Last transaction',
      ardoiseCode: "Ardoise code"
    })
    i18n.i18next.addResources('fr', 'subscribers', {
      title: 'Abonnés',
      firstName: 'Prénom',
      lastName: 'Nom',
      noResults1: 'Votre recherche pour',
      noResults2: 'n\'a retourné aucun résultat',
      status: 'Statut',
      date: 'Jour de création',
      balance: 'Solde',
      lastTransaction: 'Dernière Transaction',
      ardoiseCode: "Code d'ardoise"
    })
    return {
      tableOptions: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      headers: [
        {
          text: this.$t('subscribers:firstName'),
          value: 'firstName'
        },
        {
          text: this.$t('subscribers:lastName'),
          value: 'lastName'
        },
        {
          text: this.$t('subscribers:status'),
          value: 'statusName'
        },
        {
          text: this.$t('subscribers:balance'),
          value: 'balance'
        },
        {
          text: this.$t('subscribers:ardoiseCode'),
          value: 'ardoiseIdentifier'
        },
        {
          text: this.$t('subscribers:date'),
          value: 'createdAt'
        },
        {
          text: this.$t('subscribers:lastTransaction'),
          value: 'latestTransaction'
        },
        {
          text: '',
          sortable: false,
          value: 'edit'
        }
      ],
      subscribers: [],
      search: ''
    }
  },
  methods: {
    getStatusName: function (status) {
      if (!status) {
        return this.$t('notSubscribed')
      }
      return this.$t('subscribed')
    },
    addUser: function () {
      this.$router.push({
        name: 'Subscriber'
      })
    },
    editUser: function (user) {
      this.$router.push({
        path: '/subscriber/' + user.id
      })
    }
  },
  mounted: function () {
    UserService.clients().then(function (subscribers) {
      this.subscribers = subscribers.data.map(function (subscriber) {
        subscriber.statusName = this.getStatusName(subscriber.status)
        subscriber.balance = subscriber.balance || 0
        return subscriber
      }.bind(this))
    }.bind(this))
  }
}
</script>

<style scoped>

</style>
