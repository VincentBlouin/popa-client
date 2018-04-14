<template>
  <panel :title="$t('products:title')">
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" dark @click="addProduct()" large>
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
        :items="products"
        :search="search"
        hide-actions
        disable-initial-sort
        class="elevation-1"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td>
            <span v-if="props.item.isAvailable">
              {{$t('products:available')}}
            </span>
            <span v-if="!props.item.isAvailable">
              {{$t('products:notAvailable')}}
            </span>
          </td>
          <td>{{ props.item.name}}</td>
          <td>{{ props.item.format}}</td>
          <td>
            {{ props.item.unitPrice | currency}}
          </td>
          <td>
            {{ props.item.nbInStock}}
          </td>
          <td>{{ props.item.createdAt | dayDate}}</td>
          <td>
            <v-btn icon class="mx-0" @click="editProduct(props.item)">
              <v-icon color="secondary">edit</v-icon>
            </v-btn>
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
  import ProductService from '@/service/ProductService'

  export default {
    name: 'Products',
    data () {
      i18n.i18next.addResources('en', 'products', {
        title: 'Products',
        name: 'Name',
        format: 'Format',
        unitPrice: 'Unit price',
        nbInStock: 'Nb in stock',
        date: 'Creation day',
        availability: 'Availability',
        available: 'Available',
        notAvailable: 'Not available',
        noResults1: 'Your search for',
        noResults2: 'found no results'
      })
      i18n.i18next.addResources('fr', 'products', {
        title: 'Produits',
        name: 'Nom',
        format: 'Format',
        unitPrice: 'Prix unitaire',
        nbInStock: 'Nb en stock',
        date: 'Jour de création',
        availability: 'Disponibilité',
        available: 'Disponible',
        notAvailable: 'Non disponible',
        noResults1: 'Votre recherche pour',
        noResults2: 'n\'a retourné aucun résultat'
      })
      return {
        pagination: {
          sortBy: 'createdAt',
          descending: true,
          rowsPerPage: -1
        },
        headers: [
          {
            text: Vue.t('products:availability'),
            value: 'isAvailable'
          },
          {
            text: Vue.t('products:name'),
            value: 'name'
          },
          {
            text: Vue.t('products:format'),
            value: 'format'
          },
          {
            text: Vue.t('products:unitPrice'),
            value: 'unitPrice'
          },
          {
            text: Vue.t('products:nbInStock'),
            value: 'nbInStock'
          },
          {
            text: Vue.t('products:date'),
            value: 'createdAt'
          },
          {
            text: '',
            sortable: false
          }
        ],
        products: [],
        search: ''
      }
    },
    methods: {
      addProduct: function () {
        this.$router.push({
          name: 'Product'
        })
      },
      editProduct: function (product) {
        this.$router.push({
          path: '/product/' + product.id
        })
      }
    },
    mounted: function () {
      ProductService.listAll().then(function (products) {
        this.products = products.data.map(function (product) {
          product.name = i18n.getText(product.name)
          product.format = i18n.getText(product.format)
          return product
        })
      }.bind(this))
    }
  }
</script>

<style scoped>

</style>
