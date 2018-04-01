<template>
  <panel :title="$t('subscribers:title')">
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
      <v-data-table
        :headers="headers"
        :items="subscribers"
        :search="search"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.firstName }}</td>
          <td>{{ props.item.lastName }}</td>
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
  import SubscriberService from '@/service/SubscriberService'

  export default {
    name: 'subscribers',
    data () {
      i18n.i18next.addResources('en', 'subscribers', {
        title: 'Subscribers',
        firstName: 'Firstname',
        lastName: 'Lastname',
        noResults1: 'Your search for',
        noResults2: 'found no results'
      })
      i18n.i18next.addResources('fr', 'subscribers', {
        title: 'Abonnés',
        firstName: 'Prénom',
        lastName: 'Nom',
        noResults1: 'Votre recherche pour',
        noResults2: 'n\'a retourné aucun résultat'
      })
      return {
        headers: [
          {
            text: Vue.t('subscribers:firstName'),
            value: 'firstName'
          },
          {
            text: Vue.t('subscribers:lastName'),
            value: 'lastName'
          }
        ],
        subscribers: [],
        search: ''
      }
    },
    mounted: function () {
      SubscriberService.list().then(function (subscribers) {
        this.subscribers = subscribers.data
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
