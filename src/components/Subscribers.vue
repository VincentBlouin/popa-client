<template>
  <panel :title="$t('subscribers:title')">
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" dark @click="addUser()" large>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-title>
        <v-text-field
          append-icon="search"
          :label="$t('search')"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="subscribers"
        :search="search"
        hide-actions
        disable-initial-sort
        class="elevation-1"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.firstName }}</td>
          <td>{{ props.item.lastName }}</td>
          <td>
            {{ props.item.statusName }}
          </td>
          <td>
            {{ props.item.balance | currency }}
          </td>
          <td>{{ props.item.createdAt | dayDate}}</td>
          <td>
            <v-btn icon class="mx-0" @click="editUser(props.item)">
              <v-icon color="secondary">edit</v-icon>
            </v-btn>
          </td>
        </template>

        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          {{ $t('subscribers:noResults1') }} "{{ search }}" {{ $t('subscribers:noResults2') }}.
        </v-alert>
      </v-data-table>
    </v-card>
  </panel>
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n'
  import UserService from '@/service/UserService'

  export default {
    name: 'subscribers',
    data () {
      i18n.i18next.addResources('en', 'subscribers', {
        title: 'Subscribers',
        firstName: 'Firstname',
        lastName: 'Lastname',
        noResults1: 'Your search for',
        noResults2: 'found no results',
        status: 'Status',
        date: 'Creation day',
        balance: 'Balance'
      })
      i18n.i18next.addResources('fr', 'subscribers', {
        title: 'Abonnés',
        firstName: 'Prénom',
        lastName: 'Nom',
        noResults1: 'Votre recherche pour',
        noResults2: 'n\'a retourné aucun résultat',
        status: 'Statut',
        date: 'Jour de création',
        balance: 'Solde'
      })
      return {
        pagination: {
          sortBy: 'createdAt',
          descending: true,
          rowsPerPage: -1
        },
        headers: [
          {
            text: Vue.t('subscribers:firstName'),
            value: 'firstName'
          },
          {
            text: Vue.t('subscribers:lastName'),
            value: 'lastName'
          },
          {
            text: Vue.t('subscribers:status'),
            value: 'statusName'
          },
          {
            text: Vue.t('subscribers:balance'),
            value: 'balance'
          },
          {
            text: Vue.t('subscribers:date'),
            value: 'createdAt'
          },
          {
            text: '',
            sortable: false
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
