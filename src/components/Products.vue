<template>
  <panel :title="$t('products:title')">
    <v-card flat>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab color="primary" dark @click="addProduct()" absolute right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-data-table
          :headers="headers"
          :items="products"
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
        <template v-slot:item.isAvailable="{ item }">
          <span v-if="item.isAvailable">
              {{ $t('products:available') }}
            </span>
          <span v-if="!item.isAvailable">
              {{ $t('products:notAvailable') }}
            </span>
        </template>
        <template v-slot:item.unitPrice="{ item }">
          {{ item.unitPrice | currency }}
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | dayDate }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn icon class="mx-0" @click="editProduct(item)">
            <v-icon color="secondary">edit</v-icon>
          </v-btn>
        </template>
        <v-layout slot="no-results">
          <v-flex xs3></v-flex>
          <v-flex xs6 class="text-h6">
            {{ $t('products:noResults1') }} "{{ search }}" {{ $t('products:noResults2') }}.
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-data-table>
    </v-card>
  </panel>
</template>

<script>
import i18n from '@/i18n'
import ProductService from '@/service/ProductService'

export default {
  name: 'Products',
  data() {
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
      tableOptions: {
        sortBy: ['createdAt'],
        descending: true,
        rowsPerPage: -1
      },
      headers: [
        {
          text: this.$t('products:availability'),
          value: 'isAvailable'
        },
        {
          text: this.$t('products:name'),
          value: 'name'
        },
        {
          text: this.$t('products:format'),
          value: 'format'
        },
        {
          text: this.$t('products:unitPrice'),
          value: 'unitPrice'
        },
        {
          text: this.$t('products:nbInStock'),
          value: 'nbInStock'
        },
        {
          text: this.$t('products:date'),
          value: 'createdAt'
        },
        {
          text: '',
          sortable: false,
          value: 'edit'
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
